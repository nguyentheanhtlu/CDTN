import { Request } from 'express';
import { Blog } from '../models/blog.model';
import { IUser } from '../models/user.model';
import { CloudinaryService } from '../services/cloudinary.service';

// Thêm interface cho Request với user

export const blogController = {
    // Tạo bài viết mới
    createBlog: async (req: any, res: any) => {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const { title, content, tags, status } = req.body;
            let thumbnailUrl = '';

            // Upload thumbnail to Cloudinary if provided
            if (req.file) {
                thumbnailUrl = await CloudinaryService.uploadFile(req.file, 'blog-thumbnails');
            }

            const blog = new Blog({
                title,
                content,
                tags: tags ? JSON.parse(tags) : [],
                status,
                author: user._id,
                thumbnail: thumbnailUrl
            });

            await blog.save();
            res.status(201).json(blog);
        } catch (error) {
            res.status(500).json({ message: 'Error creating blog post', error });
        }
    },

    // Lấy danh sách bài viết
    getAllBlogs: async (req: any, res: any) => {
        try {
            const { page = 1, limit = 10, status } = req.query;
            const query: any = {};
            
            // Nếu không phải admin, chỉ hiện thị bài published
            if (!req.user || req.user.role !== 'admin') {
                query.status = 'published';
            } else if (status) {
                query.status = status;
            }

            const blogs = await Blog.find(query)
                .populate('author', 'fullName email')
                .sort({ createdAt: -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit));

            const total = await Blog.countDocuments(query);

            res.json({
                blogs,
                totalPages: Math.ceil(total / Number(limit)),
                currentPage: Number(page)
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching blogs', error });
        }
    },

    // Lấy chi tiết bài viết
    getBlogById: async (req: any, res: any) => {
        try {
            const blog = await Blog.findById(req.params.id)
                .populate('author', 'fullName email');
            
            if (!blog) {
                return res.status(404).json({ message: 'Blog not found' });
            }

            // Kiểm tra quyền xem bài viết
            if (blog.status === 'draft' && 
                (!req.user || (req.user.role !== 'admin' && req.user._id !== (blog.author as any)._id.toString()))) {
                return res.status(403).json({ message: 'Access denied' });
            }

            res.json(blog);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching blog', error });
        }
    },

    // Cập nhật bài viết
    updateBlog: async (req: any, res: any) => {
        try {
            const { title, content, tags, status } = req.body;
            
            // Tìm blog cũ
            const oldBlog = await Blog.findById(req.params.id);
            if (!oldBlog) {
                return res.status(404).json({ message: 'Blog not found' });
            }

            const updateData: any = {
                title,
                content,
                tags: tags ? JSON.parse(tags) : oldBlog.tags,
                status
            };

            // Upload new thumbnail if provided
            if (req.file) {
                // Delete old thumbnail from Cloudinary if exists
                if (oldBlog.thumbnail) {
                    try {
                        await CloudinaryService.deleteFile(oldBlog.thumbnail);
                    } catch (error) {
                        console.error('Error deleting old thumbnail:', error);
                    }
                }
                // Upload new thumbnail
                updateData.thumbnail = await CloudinaryService.uploadFile(req.file, 'blog-thumbnails');
            }

            const blog = await Blog.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true }
            );

            res.json(blog);
        } catch (error) {
            res.status(500).json({ message: 'Error updating blog', error });
        }
    },

    // Xóa bài viết
    deleteBlog: async (req: any, res: any) => {
        try {
            const blog = await Blog.findById(req.params.id);
            if (!blog) {
                return res.status(404).json({ message: 'Blog not found' });
            }

            // Delete thumbnail from Cloudinary if exists
            if (blog.thumbnail) {
                try {
                    await CloudinaryService.deleteFile(blog.thumbnail);
                } catch (error) {
                    console.error('Error deleting thumbnail:', error);
                }
            }

            await Blog.findByIdAndDelete(req.params.id);
            res.json({ message: 'Blog deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting blog', error });
        }
    }
};