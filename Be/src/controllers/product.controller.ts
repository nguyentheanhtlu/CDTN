import { Request, Response } from 'express';
import { Product, IProduct } from '../models/product.model';
import fs from 'fs';
import path from 'path';
interface AuthRequest extends Request {
    user?: any;
    files?: any[];
}

// Admin: Thêm sản phẩm mới
export const createProduct = async (req: AuthRequest, res: Response) => {
    try {
        const { name, description, price, category, stock, discount } = req.body;
        const images = req.files && req.files.length ? req.files.map(file => file.filename) : [];

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
        
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map((file: any) => file.filename);
        }

        const product = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

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
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

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