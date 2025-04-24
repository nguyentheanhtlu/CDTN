import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase.config';

export const uploadService = {
  // Upload một file lên Firebase Storage
  uploadFile: async (file: Express.Multer.File, folder: string = 'uploads'): Promise<string> => {
    try {
      const dateTime = Date.now();
      const fileName = `${folder}/${dateTime}-${file.originalname}`;
      const storageRef = ref(storage, fileName);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file.buffer);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Upload nhiều file lên Firebase Storage
  uploadMultipleFiles: async (files: Express.Multer.File[], folder: string = 'uploads'): Promise<string[]> => {
    try {
      const uploadPromises = files.map(file => {
        return uploadService.uploadFile(file, folder);
      });

      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error('Error uploading multiple files:', error);
      throw error;
    }
  },

  // Upload avatar với xử lý riêng
  uploadAvatar: async (file: Express.Multer.File, userId: string): Promise<string> => {
    try {
      const fileName = `avatars/${userId}-${Date.now()}-${file.originalname}`;
      const storageRef = ref(storage, fileName);
      
      // Upload avatar
      const snapshot = await uploadBytes(storageRef, file.buffer);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },

  // Delete file from Firebase Storage
  deleteFile: async (fileUrl: string): Promise<void> => {
    try {
      if (!fileUrl) return;
      
      // Extract file path from URL
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  // Delete nhiều file từ Firebase Storage
  deleteMultipleFiles: async (fileUrls: string[]): Promise<void> => {
    try {
      const deletePromises = fileUrls.map(url => {
        return uploadService.deleteFile(url);
      });

      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting multiple files:', error);
      throw error;
    }
  }
}; 