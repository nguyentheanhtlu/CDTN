import { Request, Response } from 'express';
import { CloudinaryService } from '../services/cloudinary.service';

export class UploadController {
  static async uploadImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const downloadURL = await CloudinaryService.uploadFile(req.file);

      return res.status(200).json({
        message: 'File uploaded successfully',
        url: downloadURL
      });
    } catch (error) {
      console.error('Error in uploadImage:', error);
      return res.status(500).json({
        message: 'Failed to upload image',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async uploadMultipleImages(req: Request, res: Response) {
    try {
      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const urls = await CloudinaryService.uploadMultipleFiles(req.files);

      return res.status(200).json({
        message: 'Files uploaded successfully',
        urls: urls
      });
    } catch (error) {
      console.error('Error in uploadMultipleImages:', error);
      return res.status(500).json({
        message: 'Failed to upload images',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async deleteImage(req: Request, res: Response) {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ message: 'URL is required' });
      }

      await CloudinaryService.deleteFile(url);

      return res.status(200).json({
        message: 'File deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteImage:', error);
      return res.status(500).json({
        message: 'Failed to delete image',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 