import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  color: { type: String, required: true },
  colorCode: { type: String }, // e.g., #4E342E
  material: { type: String, required: true },
  size: { type: String },
  stock: { type: Number, required: true, min: 0 },
  sku: { type: String, required: true, unique: true },
  priceAdjustPKR: { type: Number, default: 0 }, // If velvet costs +5000 PKR
  image: String // Specific image for this variant
}, { _id: true });

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  shortDescription: { type: String, required: true, maxlength: 200 },
  fullDescription: { type: String, required: true },
  
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, default: 'Homedecor' },
  
  basePricePKR: { type: Number, required: true },
  discountedPricePKR: { type: Number }, // Null if no active discount
  
  thumbnail: { type: String, required: true },
  images: [{ type: String }], // Array of Cloudinary URLs
  
  variants: [variantSchema],
  totalStock: { type: Number, default: 0 }, // Calculated pre-save
  
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: { type: String, enum: ['cm', 'in'], default: 'cm' }
  },
  
  tags: [{ type: String, lowercase: true }], // e.g., "minimalist", "mughal-inspired"
  
  ratingsAverage: { type: Number, default: 0, min: 0, max: 5 },
  ratingsCount: { type: Number, default: 0 },
  
  // Marketing Flags
  isFeatured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: true },
  isFlashSale: { type: Boolean, default: false },
  
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, { timestamps: true });

// --- INDEXING FOR MILLISECOND QUERIES ---
// Text index for the Search Bar
productSchema.index({ title: 'text', shortDescription: 'text', tags: 'text' }, { weights: { title: 10, tags: 5, shortDescription: 1 }});

// Compound indexes for common filter combinations
productSchema.index({ category: 1, basePricePKR: 1 });
productSchema.index({ ratingsAverage: -1 });
productSchema.index({ 'variants.color': 1 });
productSchema.index({ isFeatured: 1, isBestSeller: 1 });

// Middleware to auto-calculate total stock from variants
productSchema.pre('save', function (next) {
  if (this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce((acc, variant) => acc + variant.stock, 0);
  }
  next();
});

export default mongoose.model('Product', productSchema);