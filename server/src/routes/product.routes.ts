import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  getCuratedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getProducts);
router.get('/curated/:type', getCuratedProducts);
router.get('/:slug', getProductBySlug); // Handles both slug and ObjectId

router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;