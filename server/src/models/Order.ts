import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
  image: { type: String, required: true },
  pricePKR: { type: Number, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variant: {
    color: String,
    material: String,
    sku: String
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [orderItemSchema],
  
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true }, // Must be validated as PK number
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    province: { type: String, required: true, default: 'Punjab' },
    postalCode: { type: String, required: true },
    specialInstructions: { type: String }
  },

  paymentMethod: { 
    type: String, 
    enum: ['COD', 'JazzCash', 'EasyPaisa', 'Stripe'], 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'], 
    default: 'Pending' 
  },
  paymentTransactionId: { type: String }, // Provided by gateway webhook

  orderStatus: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  },

  // Financials
  subtotalPKR: { type: Number, required: true },
  shippingFeePKR: { type: Number, required: true },
  taxAmountPKR: { type: Number, default: 0 },
  discountAmountPKR: { type: Number, default: 0 },
  totalAmountPKR: { type: Number, required: true },

  // Logistics
  trackingNumber: { type: String },
  estimatedDelivery: { type: Date },
  deliveredAt: { type: Date },
  paidAt: { type: Date },

}, { timestamps: true });

// Index for Admin Dashboards
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });

export default mongoose.model('Order', orderSchema);