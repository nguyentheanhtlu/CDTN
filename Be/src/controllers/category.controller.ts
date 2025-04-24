import { Request, Response } from 'express';
import { Category, ICategory } from '../models/category.model';

// Thêm danh mục mới
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const category = new Category({ name, description });
        await category.save();
        res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error });
    }
};

// Cập nhật danh mục
export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const category = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category updated successfully', category });
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error });
    }
};

// Xóa danh mục
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error });
    }
};

// Lấy danh sách danh mục
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error getting categories', error });
    }
}; 