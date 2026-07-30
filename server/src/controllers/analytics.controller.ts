import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import User from '../models/User';
import Product from '../models/Product';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    // 1. Core KPIs
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmountPKR' } } }
    ]);

    const orderCount = await Order.countDocuments();
    const customerCount = await User.countDocuments({ role: 'user' });

    // 2. Monthly Revenue Chart Data (Last 6 Months)
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, 1);
    const monthlyRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'Paid', createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          revenue: { $sum: '$totalAmountPKR' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Format for Recharts
    const chartData = monthlyRevenue.map(item => ({
      name: new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'short' }),
      revenue: item.revenue,
      orders: item.orders
    }));

    // 3. Top Selling Products
    const topProducts = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.title',
          totalSold: { $sum: '$orderItems.qty' },
          revenue: { $sum: { $multiply: ['$orderItems.pricePKR', '$orderItems.qty'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        kpis: {
          revenue: totalRevenue[0]?.total || 0,
          orders: orderCount,
          customers: customerCount
        },
        chartData,
        topProducts
      }
    });
  } catch (error) {
    next(error);
  }
};