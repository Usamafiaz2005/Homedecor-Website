import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { calculatePKShipping } from '../utils/shippingCalculator';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // 1. Re-calculate prices from DB (NEVER trust frontend prices)
    let subtotalPKR = 0;
    const validatedItems = await Promise.all(orderItems.map(async (item: any) => {
      const product = await Product.findById(item.product);
      if (!product) throw new Error(`Product ${item.product} not found`);
      
      const price = product.discountedPricePKR || product.basePricePKR;
      subtotalPKR += price * item.qty;

      // Check variant stock if specified
      if (item.variant && item.variant.sku) {
        const variant = product.variants.find(v => v.sku === item.variant.sku);
        if (variant && variant.stock < item.qty) {
          throw new Error(`Insufficient stock for ${product.title}`);
        }
      }

      return {
        title: product.title,
        qty: item.qty,
        image: product.thumbnail,
        pricePKR: price,
        product: product._id,
        variant: item.variant || {}
      };
    }));

    // 2. Calculate Shipping & Totals
    const shippingFeePKR = calculatePKShipping(shippingAddress.city, subtotalPKR);
    let discountAmountPKR = 0;
    const totalAmountPKR = subtotalPKR + shippingFeePKR - discountAmountPKR;

    // 3. Create Order
    const order = await Order.create({
      user: req.user!.id,
      orderItems: validatedItems,
      shippingAddress,
      paymentMethod,
      subtotalPKR,
      shippingFeePKR,
      discountAmountPKR,
      totalAmountPKR,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days default
    });

    // 4. Handle Stock Deduction
    for (const item of validatedItems) {
      if (item.variant && item.variant.sku) {
        await Product.updateOne(
          { _id: item.product, 'variants.sku': item.variant.sku },
          { 
            $inc: { 
              'variants.$.stock': -item.qty,
              totalStock: -item.qty
            } 
          }
        );
      } else {
        await Product.updateOne(
          { _id: item.product },
          { $inc: { totalStock: -item.qty } }
        );
      }
    }

    res.status(201).json({ status: 'success', data: { order } });
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find({ user: req.user!.id }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: { orders } });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (req.query.status) {
      filter.orderStatus = req.query.status;
    }
    if (req.query.paymentStatus) {
      filter.paymentStatus = req.query.paymentStatus;
    }

    const orders = await Order.find(filter)
      .populate('user', 'fullName email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      total,
      page,
      pages: Math.ceil(total / limit),
      data: { orders },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'fullName email phone');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check ownership if not admin
    if (req.user!.role !== 'admin' && order.user._id.toString() !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.status(200).json({ status: 'success', data: { order } });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus, trackingNumber, estimatedDelivery } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const previousStatus = order.orderStatus;

    if (orderStatus) {
      order.orderStatus = orderStatus;
      if (orderStatus === 'Delivered' && !order.deliveredAt) {
        order.deliveredAt = new Date();
      }

      // Restore inventory stock if order is cancelled
      if (orderStatus === 'Cancelled' && previousStatus !== 'Cancelled') {
        for (const item of order.orderItems) {
          if (item.variant && item.variant.sku) {
            await Product.updateOne(
              { _id: item.product, 'variants.sku': item.variant.sku },
              { $inc: { 'variants.$.stock': item.qty, totalStock: item.qty } }
            );
          } else {
            await Product.updateOne(
              { _id: item.product },
              { $inc: { totalStock: item.qty } }
            );
          }
        }
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
      if (paymentStatus === 'Paid' && !order.paidAt) {
        order.paidAt = new Date();
      }
    }

    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);

    await order.save();

    res.status(200).json({
      status: 'success',
      message: 'Order updated successfully',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};