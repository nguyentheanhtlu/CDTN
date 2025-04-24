import multer from 'multer';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to allow only images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'));
  }
};

// Cấu hình chung cho multer
const multerConfig = {
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
};

// Middleware cho upload một ảnh
export const upload = multer(multerConfig);

// Middleware cho upload avatar
export const uploadAvatar = multer({
  ...multerConfig,
  limits: {
    fileSize: 2 * 1024 * 1024 // Giới hạn 2MB cho avatar
  }
}).single('avatar');

// Middleware cho upload nhiều ảnh
export const uploadImages = multer({
  ...multerConfig,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB cho mỗi ảnh
  }
}).array('images', 5); // Tối đa 5 ảnh một lần 