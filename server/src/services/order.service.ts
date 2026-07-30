import Order from '../models/Order';
import { calculatePKShipping } from '../utils/shippingCalculator';

export const createOrderService = async (userId: string, orderData: any) => {
  // 1. Calculate items total FIRST
  const itemsTotal = orderData.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  
  // 2. Get the city SECOND
  const city = orderData.shippingAddress?.city || '';
  
  // 3. Calculate realistic Lahore/Pakistan shipping THIRD
  const shippingFee = calculatePKShipping(city, itemsTotal);
  
  // 4. Calculate grand total FOURTH
  const grandTotal = itemsTotal + shippingFee;

  // 5. Create Order
  const order = await Order.create({
    user: userId,
    ...orderData,
    shippingFee,
    totalAmount: grandTotal,
  });

  return order;
};