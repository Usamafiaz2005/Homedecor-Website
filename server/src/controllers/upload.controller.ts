import { Request, Response } from 'express';
import { UploadService } from '../services/upload.service';

export const uploadImages = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    const singleFile = req.file as Express.Multer.File | undefined;

    const fileList = files || (singleFile ? [singleFile] : []);

    if (!fileList || fileList.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files provided for upload',
      });
    }

    const folder = (req.body.folder as string) || 'homedecor/uploads';
    const uploadPromises = fileList.map((f) =>
      UploadService.uploadBuffer(f.buffer, folder, f.mimetype)
    );

    const results = await Promise.all(uploadPromises);

    return res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: results.length === 1 ? results[0] : results,
    });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Image upload failed',
    });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { publicId } = req.params;
    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'publicId required',
      });
    }

    const deleted = await UploadService.deleteImage(publicId);
    return res.status(200).json({
      success: true,
      message: deleted ? 'Image deleted successfully' : 'Image deletion failed',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete image',
    });
  }
};
