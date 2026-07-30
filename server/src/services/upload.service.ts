import cloudinary from '../config/cloudinary';
import env from '../config/env';

export interface UploadResult {
  url: string;
  publicId: string;
}

export class UploadService {
  /**
   * Upload a memory buffer to Cloudinary
   */
  static async uploadBuffer(
    buffer: Buffer,
    folder: string = 'homedecor/products',
    mimetype: string = 'image/jpeg'
  ): Promise<UploadResult> {
    // If Cloudinary isn't configured, generate a data URI fallback
    if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${mimetype};base64,${base64}`;
      return {
        url: dataUrl,
        publicId: `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      };
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Upload failed'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );

      uploadStream.end(buffer);
    });
  }

  /**
   * Delete an asset from Cloudinary by publicId
   */
  static async deleteImage(publicId: string): Promise<boolean> {
    if (publicId.startsWith('mock_')) {
      return true;
    }
    if (!env.CLOUDINARY_CLOUD_NAME) {
      return true;
    }

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (err) {
      console.error('Cloudinary destroy error:', err);
      return false;
    }
  }
}
