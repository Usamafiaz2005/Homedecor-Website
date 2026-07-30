import { Router } from 'express';
import {
  getCmsBlocks,
  getCmsBlockById,
  upsertCmsBlock,
  deleteCmsBlock,
} from '../controllers/cms.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getCmsBlocks);
router.get('/:blockId', getCmsBlockById);
router.post('/', protect, adminOnly, upsertCmsBlock);
router.put('/', protect, adminOnly, upsertCmsBlock);
router.delete('/:blockId', protect, adminOnly, deleteCmsBlock);

export default router;
