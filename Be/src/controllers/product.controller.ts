import { Request, Response } from 'express';
import { Product, IProduct } from '../models/product.model';
import { CloudinaryService } from '../services/cloudinary.service';
import mongoose from 'mongoose';
import { Order } from '../models/order.model';

interface AuthRequest extends Request {
    user?: any;
    files?: Express.Multer.File[];
}

// Admin: Thêm sản phẩm mới
export const createProduct = async (req: AuthRequest, res: Response) => {
    try {
        const { name, description, price, category, stock, discount } = req.body;
        let images: string[] = [];

        // Upload images to Cloudinary if provided
        if (req.files && req.files.length > 0) {
            try {
                images = await CloudinaryService.uploadMultipleFiles(req.files, 'products');
            } catch (error) {
                console.error('Error uploading product images:', error);
                return res.status(500).json({ message: 'Lỗi khi upload ảnh sản phẩm' });
            }
        }

        const product = new Product({
            name,
            description,
            price,
            images,
            category,
            stock,
            discount
        });

        await product.save();

        res.status(201).json({
            message: 'Thêm sản phẩm thành công',
            product
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm sản phẩm', error });
    }
};

// Admin: Cập nhật sản phẩm
export const updateProduct = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Tìm sản phẩm cũ
        const oldProduct = await Product.findById(id);
        if (!oldProduct) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        // Upload new images if provided
        if (req.files && req.files.length > 0) {
            try {
                // Delete old images from Cloudinary
                if (oldProduct.images && oldProduct.images.length > 0) {
                    await CloudinaryService.deleteMultipleFiles(oldProduct.images);
                }
                
                // Upload new images
                updateData.images = await CloudinaryService.uploadMultipleFiles(req.files, 'products');
            } catch (error) {
                console.error('Error handling product images:', error);
                return res.status(500).json({ message: 'Lỗi khi xử lý ảnh sản phẩm' });
            }
        }

        const product = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        res.json({
            message: 'Cập nhật sản phẩm thành công',
            product
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error });
    }
};

// Admin: Xóa sản phẩm
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        // Delete images from Cloudinary
        if (product.images && product.images.length > 0) {
            try {
                await CloudinaryService.deleteMultipleFiles(product.images);
            } catch (error) {
                console.error('Error deleting product images:', error);
            }
        }

        await Product.findByIdAndDelete(id);
        res.json({ message: 'Xóa sản phẩm thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error });
    }
};

// Public: Lấy danh sách sản phẩm
export const getProducts = async (req: Request, res: Response) => {
    try {
        const { category, search, sort, page = 1, limit = 10 } = req.query;
        const query: any = {};

        // Lọc theo danh mục
        if (category) {
            query.category = category;
        }

        // Tìm kiếm theo tên
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Chỉ hiển thị sản phẩm còn hàng
        query.isAvailable = true;

        // Sắp xếp
        let sortOption: any = { createdAt: -1 };
        if (sort === 'price-asc') sortOption = { price: 1 };
        if (sort === 'price-desc') sortOption = { price: -1 };
        if (sort === 'popular') sortOption = { sold: -1 };

        const skip = (Number(page) - 1) * Number(limit);

        const [products, total] = await Promise.all([
            Product.find(query)
                .sort(sortOption)
                .skip(skip)
                .limit(Number(limit)),
            Product.countDocuments(query)
        ]);

        res.json({
            products,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit))
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error });
    }
};

// Public: Lấy chi tiết sản phẩm
export const getProductDetail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin sản phẩm', error });
    }
};

// Helper: kiểm tra user đã mua sản phẩm chưa
async function hasPurchasedProduct(userId: string, productId: string) {
    const order = await Order.findOne({
        user: userId,
        orderStatus: 'DELIVERED',
        'items.product': productId
    });
    return !!order;
}

// Khách hàng đánh giá sản phẩm
export const reviewProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userId = (req.user?._id || req.user?.id || '').toString();
        if (!userId) return res.status(401).json({ message: 'Chưa đăng nhập' });
        if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: 'Số sao phải từ 1 đến 5' });
        // Kiểm tra đã mua hàng chưa
        const purchased = await hasPurchasedProduct(userId, id);
        if (!purchased) return res.status(403).json({ message: 'Bạn chỉ có thể đánh giá khi đã mua và nhận hàng sản phẩm này.' });
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        if (!product.reviews) product.reviews = [];
        const userObjectId = new mongoose.Types.ObjectId(userId);
        // Kiểm tra user đã đánh giá chưa
        const existingReview = product.reviews.find(r => r.user.toString() === userObjectId.toString());
        if (existingReview) {
            existingReview.rating = rating;
            existingReview.comment = comment;
            existingReview.createdAt = new Date();
        } else {
            product.reviews.push({ user: userObjectId, rating, comment, createdAt: new Date() });
        }
        // Tính lại averageRating và reviewCount
        product.reviewCount = product.reviews.length;
        product.averageRating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviewCount;
        await product.save();
        res.json({ message: 'Đánh giá thành công', product });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi đánh giá sản phẩm', error });
    }
};

// Sửa đánh giá sản phẩm
export const updateReviewProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userId = (req.user?._id || req.user?.id || '').toString();
        if (!userId) return res.status(401).json({ message: 'Chưa đăng nhập' });
        if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: 'Số sao phải từ 1 đến 5' });
        // Kiểm tra đã mua hàng chưa
        const purchased = await hasPurchasedProduct(userId, id);
        if (!purchased) return res.status(403).json({ message: 'Bạn chỉ có thể sửa đánh giá khi đã mua và nhận hàng sản phẩm này.' });
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        if (!product.reviews) product.reviews = [];
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const existingReview = product.reviews.find(r => r.user.toString() === userObjectId.toString());
        if (!existingReview) return res.status(404).json({ message: 'Bạn chưa đánh giá sản phẩm này' });
        existingReview.rating = rating;
        existingReview.comment = comment;
        existingReview.createdAt = new Date();
        // Tính lại averageRating và reviewCount
        product.reviewCount = product.reviews.length;
        product.averageRating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviewCount;
        await product.save();
        res.json({ message: 'Cập nhật đánh giá thành công', product });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật đánh giá', error });
    }
};

// Xóa đánh giá sản phẩm
export const deleteReviewProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req.user?._id || req.user?.id || '').toString();
        if (!userId) return res.status(401).json({ message: 'Chưa đăng nhập' });
        // Kiểm tra đã mua hàng chưa
        const purchased = await hasPurchasedProduct(userId, id);
        if (!purchased) return res.status(403).json({ message: 'Bạn chỉ có thể xóa đánh giá khi đã mua và nhận hàng sản phẩm này.' });
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        if (!product.reviews) product.reviews = [];
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const reviewIndex = product.reviews.findIndex(r => r.user.toString() === userObjectId.toString());
        if (reviewIndex === -1) return res.status(404).json({ message: 'Bạn chưa đánh giá sản phẩm này' });
        product.reviews.splice(reviewIndex, 1);
        // Tính lại averageRating và reviewCount
        product.reviewCount = product.reviews.length;
        product.averageRating = product.reviewCount > 0 ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviewCount : 0;
        await product.save();
        res.json({ message: 'Xóa đánh giá thành công', product });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa đánh giá', error });
    }
};

// Lấy danh sách đánh giá sản phẩm, hỗ trợ lọc theo số sao
export const getProductReviews = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { rating } = req.query;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        let reviews = product.reviews || [];
        if (rating) {
            const ratingNum = Number(rating);
            reviews = reviews.filter(r => r.rating === ratingNum);
        }
        res.json({
            reviews,
            total: reviews.length,
            averageRating: product.averageRating || 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy đánh giá sản phẩm', error });
    }
}; 