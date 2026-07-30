import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import { generateJazzCashHash } from '../utils/jazzcashHash';

export const initiateJazzCash = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const now = new Date();
    const expiry = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour expiry

    // JazzCash standard payload structure
    const payload = {
      pp_Version: '1.1',
      pp_TxnType: 'MWALLET', // Mobile Wallet
      pp_Language: 'EN',
      pp_MerchantID: process.env.JC_MERCHANT_ID,
      pp_SubMerchantID: '',
      pp_Password: process.env.JC_PASSWORD,
      pp_BankID: 'TBANK',
      pp_ProductID: 'RETL',
      pp_TxnRefNo: `RWYT${order._id}`,
      pp_Amount: (order.totalAmountPKR * 100).toString(), // Format: paisas (amount * 100)
      pp_TxnCurrency: 'PKR',
      pp_TxnDateTime: now.toISOString().replace(/[-:T.]/g, '').slice(0, 14),
      pp_BillReference: `order_${order._id}`,
      pp_Description: 'Homedecor Purchase',
      pp_TxnExpiryDateTime: expiry.toISOString().replace(/[-:T.]/g, '').slice(0, 14),
      pp_ReturnURL: `${process.env.FRONTEND_URL}/checkout/success/${order._id}`,
      pp_SecureHash: '',
    };

    payload.pp_SecureHash = generateJazzCashHash(payload, process.env.JC_INTEGRITY_SALT!);

    // Send payload to frontend to inject into a hidden form and auto-submit to JazzCash Gateway
    res.status(200).json({ status: 'success', data: { gatewayUrl: process.env.JC_ENDPOINT, payload } });
  } catch (error) {
    next(error);
  }
};