import { Request, Response } from 'express';
import { User, IUser } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { CloudinaryService } from '../services/cloudinary.service';

interface AuthRequest extends Request {
    user?: IUser;
    file?: Express.Multer.File;
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
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                phone: user.phone,
                address: user.address,
                avatar: user.avatar,
                role: user.role,
                vipLevel: user.vipLevel,
                vipRank: user.vipRank,
                totalSpent: user.totalSpent,
                vouchers: user.vouchers
            }
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
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        try {
            // Upload ảnh lên Cloudinary
            const downloadURL = await CloudinaryService.uploadFile(req.file, 'avatars');

            // Nếu user đã có avatar cũ, xóa nó khỏi Cloudinary
            if (user.avatar) {
                try {
                    await CloudinaryService.deleteFile(user.avatar);
                } catch (error) {
                    console.error('Error deleting old avatar:', error);
                }
            }

            // Cập nhật URL avatar mới vào database
            user.avatar = downloadURL;
            await user.save();

            res.json({
                message: 'Cập nhật avatar thành công',
                avatar: user.avatar
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Lỗi khi upload ảnh', 
                error: error instanceof Error ? error.message : 'Unknown error' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi cập nhật avatar', 
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
};

// Admin: Cấp phát voucher cho user
export const grantVoucherToUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { type, value, expiredAt } = req.body;
        if (!['discount', 'free_shipping'].includes(type)) {
            return res.status(400).json({ message: 'Loại voucher không hợp lệ' });
        }
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
        user.vouchers = user.vouchers || [];
        user.vouchers.push({ type, value, status: 'active', expiredAt });
        await user.save();
        res.json({ message: 'Cấp phát voucher thành công', vouchers: user.vouchers });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cấp phát voucher', error });
    }
};

// Admin: Xóa voucher khỏi user (theo id)
export const removeVoucherFromUser = async (req: Request, res: Response) => {
    try {
        const { userId, voucherId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
        
        user.vouchers = user.vouchers || [];
        // Tìm voucher theo _id của MongoDB
        const voucherIndex = user.vouchers.findIndex(v => v._id && v._id.toString() === voucherId);
        
        if (voucherIndex === -1) {
            return res.status(404).json({ message: 'Không tìm thấy voucher' });
        }

        user.vouchers.splice(voucherIndex, 1);
        await user.save();
        res.json({ message: 'Xóa voucher thành công', vouchers: user.vouchers });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa voucher', error });
    }
};

// Lấy danh sách voucher của user (admin hoặc chính user)
export const getUserVouchers = async (req: AuthRequest, res: Response) => {
    try {
        // Lấy userId từ user đã authenticate
        const userId = req.user?._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
        res.json({ vouchers: user.vouchers || [] });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy voucher', error });
    }
};

// Lấy tất cả user có voucher (admin)
export const getAllUsersWithVouchers = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }
        const users = await User.find({ 'vouchers.0': { $exists: true } }).select('fullName email vouchers');
        res.json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách user có voucher', error });
    }
};

// Lấy lịch sử voucher đã dùng của user (admin hoặc chính user)
export const getUserVoucherHistory = async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;
        const requester = req.user;
        if (!requester || (requester.role !== 'admin' && requester._id !== userId)) {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
        const usedVouchers = (user.vouchers || []).filter(v => v.status === 'used');
        res.json({ usedVouchers });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy lịch sử voucher', error });
    }
};

// Lấy danh sách địa chỉ của user
export const getUserAddresses = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
        res.json({ addresses: user.addresses || [] });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách địa chỉ', error });
    }
};   

// Thêm địa chỉ mới
export const addUserAddress = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const { name, phone, addressLine, ward, district, province, isDefault } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
        if (!user.addresses) user.addresses = [];
        if (isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }
        user.addresses.push({ name, phone, addressLine, ward, district, province, isDefault: !!isDefault });
        await user.save();
        res.json({ message: 'Thêm địa chỉ thành công', addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm địa chỉ', error });
    }
};

// Sửa địa chỉ (theo index)
export const updateUserAddress = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;
        const { name, phone, addressLine, ward, district, province, isDefault } = req.body;
        const user = await User.findById(userId);
        
        if (!user || !user.addresses) {
            return res.status(404).json({ message: 'Không tìm thấy user' });
        }

        const addressIndex = user.addresses.findIndex(addr => addr._id && addr._id.toString() === id);
        if (addressIndex === -1) {
            return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
        }

        if (isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        user.addresses[addressIndex] = { 
            ...user.addresses[addressIndex],
            name, 
            phone, 
            addressLine, 
            ward, 
            district, 
            province, 
            isDefault: !!isDefault 
        };

        await user.save();
        res.json({ message: 'Cập nhật địa chỉ thành công', addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật địa chỉ', error });
    }
};

// Xóa địa chỉ (theo id)
export const deleteUserAddress = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;
        const user = await User.findById(userId);
        
        if (!user || !user.addresses) {
            return res.status(404).json({ message: 'Không tìm thấy user' });
        }

        const addressIndex = user.addresses.findIndex(addr => addr._id && addr._id.toString() === id);
        if (addressIndex === -1) {
            return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
        }

        user.addresses.splice(addressIndex, 1);
        await user.save();
        res.json({ message: 'Xóa địa chỉ thành công', addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa địa chỉ', error });
    }
};

// Đặt địa chỉ mặc định (theo id)
export const setDefaultUserAddress = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;
        const user = await User.findById(userId);
        
        if (!user || !user.addresses) {
            return res.status(404).json({ message: 'Không tìm thấy user' });
        }

        const addressIndex = user.addresses.findIndex(addr => addr._id && addr._id.toString() === id);
        if (addressIndex === -1) {
            return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
        }

        user.addresses.forEach((addr, i) => addr.isDefault = i === addressIndex);
        await user.save();
        res.json({ message: 'Đặt địa chỉ mặc định thành công', addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi đặt địa chỉ mặc định', error });
    }
};

// Lấy tất cả user (admin)
export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }
        const users = await User.find({ role: 'customer' }).select('-password -verificationCode -verificationCodeExpires');
        res.json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách user', error });
    }
};

// Lấy thông tin chi tiết người dùng theo ID (admin)
export const getUserById = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        const { id } = req.params;
        const user = await User.findById(id)
            .select('-password -verificationCode -verificationCodeExpires');
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng', error });
    }
}; 