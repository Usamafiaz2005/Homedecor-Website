import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import { ApiFeatures } from '../utils/ApiFeatures';

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// @desc    Get all products with advanced filtering & search
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Execute query builder
    const features = new ApiFeatures(Product.find().populate('category', 'name slug'), req.query)
      .search()
      .filter()
      .sort()
      .paginate();

    const products = await features.query;
    
    // Get total count for frontend pagination
    const totalFeatures = new ApiFeatures(Product.find(), req.query).search().filter();
    const total = await totalFeatures.query.countDocuments();

    res.status(200).json({
      status: 'success',
      results: products.length,
      total,
      data: { products }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by Slug or ID
// @route   GET /api/products/:slugOrId
// @access  Public
export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    let product;

    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slug).populate('category', 'name slug');
    } else {
      product = await Product.findOne({ slug }).populate('category', 'name slug');
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get Related Products (Same category, different ID)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);

    res.status(200).json({
      status: 'success',
      data: { product, relatedProducts }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get specialized curated lists
// @route   GET /api/products/curated/:type
export const getCuratedProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.params;
    let filter = {};

    switch(type) {
      case 'featured': filter = { isFeatured: true }; break;
      case 'trending': filter = { isBestSeller: true }; break;
      case 'flash-sale': filter = { isFlashSale: true }; break;
      default: return res.status(400).json({ message: 'Invalid list type' });
    }

    const products = await Product.find(filter).limit(8).sort('-createdAt');
    res.status(200).json({ status: 'success', data: { products } });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title,
      slug: customSlug,
      shortDescription,
      fullDescription,
      category,
      brand,
      basePricePKR,
      discountedPricePKR,
      thumbnail,
      images,
      variants,
      totalStock,
      dimensions,
      tags,
      isFeatured,
      isBestSeller,
      isNewArrival,
      isFlashSale,
      seo,
    } = req.body;

    if (!title || !shortDescription || !fullDescription || !category || !basePricePKR || !thumbnail) {
      return res.status(400).json({
        success: false,
        message: 'Missing required product fields (title, shortDescription, fullDescription, category, basePricePKR, thumbnail)',
      });
    }

    const slug = customSlug ? slugify(customSlug) : slugify(title);
    const existing = await Product.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Product slug '${slug}' is already taken`,
      });
    }

    const product = await Product.create({
      title,
      slug,
      shortDescription,
      fullDescription,
      category,
      brand: brand || 'Homedecor',
      basePricePKR,
      discountedPricePKR: discountedPricePKR || undefined,
      thumbnail,
      images: images || [thumbnail],
      variants: variants || [],
      totalStock: totalStock || 0,
      dimensions,
      tags: tags || [],
      isFeatured: !!isFeatured,
      isBestSeller: !!isBestSeller,
      isNewArrival: isNewArrival !== undefined ? !!isNewArrival : true,
      isFlashSale: !!isFlashSale,
      seo,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (req.body.title && req.body.title !== product.title && !req.body.slug) {
      req.body.slug = slugify(req.body.title);
    } else if (req.body.slug) {
      req.body.slug = slugify(req.body.slug);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: { product: updatedProduct },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};