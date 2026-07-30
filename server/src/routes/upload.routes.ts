import { Router } from 'express';
import multer from 'multer';
import { uploadImages, deleteImage } from '../controllers/upload.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

// Protect upload endpoints for authenticated admins
router.post('/', protect, adminOnly, upload.array('images', 10), uploadImages);
router.delete('/:publicId(*)', protect, adminOnly, deleteImage);

export default router;
