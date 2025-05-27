import cloudinary from '../config/cloudinary.config';
import { Readable } from 'stream';

export class CloudinaryService {
  static async uploadFile(file: Express.Multer.File, folder: string = 'uploads'): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result?.secure_url || '');
          }
        );

        // Convert buffer to stream
        const stream = Readable.from(file.buffer);
        stream.pipe(uploadStream);
      });
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
      throw error;
    }
  }

  static async uploadMultipleFiles(files: Express.Multer.File[], folder: string = 'uploads'): Promise<string[]> {
    try {
      const uploadPromises = files.map(file => this.uploadFile(file, folder));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple files to Cloudinary:', error);
      throw error;
    }
  }

  static async deleteFile(publicUrl: string): Promise<void> {
    try {
      // Extract public ID from URL
      const publicId = publicUrl.split('/').slice(-1)[0].split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting file from Cloudinary:', error);
      throw error;
    }
  }

  static async deleteMultipleFiles(publicUrls: string[]): Promise<void> {
    try {
      const deletePromises = publicUrls.map(url => this.deleteFile(url));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting multiple files from Cloudinary:', error);
      throw error;
    }
  }
} 