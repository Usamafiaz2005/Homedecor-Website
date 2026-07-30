import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  description: String,
  image: { type: String, required: true }, // Cloudinary URL
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

categorySchema.index({ parentCategory: 1 });

export default mongoose.model('Category', categorySchema);