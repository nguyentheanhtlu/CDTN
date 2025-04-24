import { Request, Response } from 'express';
import { User, IUser } from '../models/user.model';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

interface AuthRequest extends Request {
    user?: IUser;
    file?: any; // Multer file type
}

// Lấy thông tin người dùng
export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const user = await User.findById(userId).select('-password -verificationCode -verificationCodeExpires');
        
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        res.json({
            message: 'Lấy thông tin thành công',
            user
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng', error });
    }
};

// Cập nhật thông tin cơ bản
export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const { fullName, phone, address } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // Cập nhật thông tin
        user.fullName = fullName || user.fullName;
        user.phone = phone || user.phone;
        user.address = address || user.address;

        await user.save();

        res.json({
            message: 'Cập nhật thông tin thành công',
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                phone: user.phone,
                address: user.address,
                avatar: user.avatar,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật thông tin', error });
    }
};

// Đổi mật khẩu
export const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // Kiểm tra mật khẩu hiện tại
        const isValidPassword = await user.comparePassword(currentPassword);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });
        }

        // Mã hóa và cập nhật mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi đổi mật khẩu', error });
    }
};

// Cập nhật avatar
export const updateAvatar = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Không tìm thấy file ảnh' });
        }

        const userId = req.user?._id;
        const user = await User.findById(userId);
        
        if (!user) {
            // Xóa file nếu upload thất bại
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // Xóa avatar cũ nếu không phải avatar mặc định
        if (user.avatar && user.avatar !== 'default-avatar.png') {
            const oldAvatarPath = path.join(__dirname, '../../uploads/avatars', user.avatar);
            if (fs.existsSync(oldAvatarPath)) {
                fs.unlinkSync(oldAvatarPath);
            }
        }

        // Cập nhật đường dẫn avatar mới
        user.avatar = req.file.filename;
        await user.save();

        res.json({
            message: 'Cập nhật avatar thành công',
            avatar: user.avatar
        });
    } catch (error) {
        // Xóa file nếu có lỗi xảy ra
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Lỗi khi cập nhật avatar', error });
    }
}; 