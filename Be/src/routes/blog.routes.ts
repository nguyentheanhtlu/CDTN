import express from 'express';
import { blogController } from '../controllers/blog.controller';
import { isAdmin } from '../middlewares/admin.middleware';
import multer from 'multer';
import path from 'path';
import passport from 'passport';
import fs from 'fs';

const router = express.Router();

// Tạo thư mục uploads nếu chưa tồn tại
const uploadDir = 'uploads/blogs';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer cho upload ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Loại bỏ các ký tự đặc biệt và khoảng trắng từ tên file gốc
        const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${cleanFileName}`);
    }
});

// Cấu hình multer với xử lý lỗi
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // Kiểm tra mime type của file
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, JPG, PNG and WEBP files are allowed.'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).single('thumbnail');

// Middleware xử lý lỗi upload
const handleUpload = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Lỗi từ multer
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File size too large. Maximum size is 5MB.' });
            }
            return res.status(400).json({ message: err.message });
        } else if (err) {
            // Lỗi khác
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);

// Admin routes
router.post('/',
    passport.authenticate('jwt', { session: false }),
    isAdmin,
    handleUpload,
    blogController.createBlog
);

router.put('/:id',
    passport.authenticate('jwt', { session: false }),
    isAdmin,
    handleUpload,
    blogController.updateBlog
);

router.delete('/:id',
    passport.authenticate('jwt', { session: false }),
    isAdmin,
    blogController.deleteBlog
);

export default router;