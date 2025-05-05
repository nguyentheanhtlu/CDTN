import express from 'express';
import { UploadController } from '../controllers/upload.controller';
import { upload } from '../middlewares/upload.middleware';

const router = express.Router();

// Upload một ảnh
router.post('/upload', upload.single('image'), UploadController.uploadImage);

// Upload nhiều ảnh
router.post('/upload-multiple', upload.array('images', 10), UploadController.uploadMultipleImages);

// Xóa ảnh
router.delete('/delete', UploadController.deleteImage);

export default router; 