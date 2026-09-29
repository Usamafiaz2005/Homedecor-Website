import { z } from 'zod';

export const uploadQuerySchema = z.object({
  body: z.object({
    folder: z.string().optional().default('homedecor/uploads'),
  }),
});

export const deleteImageParamSchema = z.object({
  params: z.object({
    publicId: z.string().min(1, 'Cloudinary public ID is required'),
  }),
});

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/jpg',
];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
