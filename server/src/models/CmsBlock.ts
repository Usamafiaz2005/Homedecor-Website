import mongoose from 'mongoose';

const cmsBlockSchema = new mongoose.Schema({
  blockId: { type: String, required: true, unique: true }, // e.g., 'home-hero-1', 'promo-banner'
  type: { type: String, enum: ['hero', 'banner', 'testimonial', 'faq'], required: true },
  title: { type: String },
  subtitle: { type: String },
  content: { type: String }, // Can hold rich text/HTML
  mediaUrl: { type: String }, // Cloudinary URL
  ctaText: { type: String },
  ctaLink: { type: String },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 } // For sorting testimonials/FAQs
}, { timestamps: true });

export default mongoose.model('CmsBlock', cmsBlockSchema);