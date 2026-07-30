import { Request, Response } from 'express';
import Category from '../models/Category';

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { includeInactive } = req.query;
    const filter = includeInactive === 'true' ? {} : { isActive: true };
    const categories = await Category.find(filter).populate('parentCategory', 'name slug').sort({ name: 1 });
    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch categories',
    });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id).populate('parentCategory', 'name slug');
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return res.status(200).json({ success: true, data: category });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, image, parentCategory, isActive } = req.body;
    if (!name || !image) {
      return res.status(400).json({ success: false, message: 'Name and image are required' });
    }

    const slug = req.body.slug ? slugify(req.body.slug) : slugify(name);
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category with this slug already exists' });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      parentCategory: parentCategory || null,
      isActive: isActive ?? true,
    });

    return res.status(201).json({ success: true, data: category });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to create category' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, image, parentCategory, isActive, slug: customSlug } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (name && name !== category.name) {
      category.name = name;
      category.slug = customSlug ? slugify(customSlug) : slugify(name);
    } else if (customSlug) {
      category.slug = slugify(customSlug);
    }

    if (description !== undefined) category.description = description;
    if (image) category.image = image;
    if (parentCategory !== undefined) category.parentCategory = parentCategory || null;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();
    return res.status(200).json({ success: true, data: category });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to update category' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
