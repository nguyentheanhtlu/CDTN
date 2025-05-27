import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IVoucher {
    _id?: string; // MongoDB's _id field
    type: 'discount' | 'free_shipping'; // loại voucher
    value: number; // giá trị giảm giá (phần trăm hoặc số tiền)
    status: 'active' | 'used' | 'expired';
    expiredAt?: Date;
}

export interface IUserAddress {
    _id?: string;
    name: string;
    phone: string;
    addressLine: string;
    ward: string;
    district: string;
    province: string;
    isDefault?: boolean;
}

export interface IUser extends Document {
    email: string;
    password?: string;
    fullName: string;
    role: 'admin' | 'customer';
    phone?: string;
    address?: string;
    avatar?: string;
    googleId?: string;
    isVerified: boolean;
    verificationCode?: string;
    verificationCodeExpires?: Date;
    totalSpent?: number;
    vipLevel?: number;
    vipRank?: 'Đồng' | 'Bạc' | 'Vàng' | 'Kim cương';
    vouchers?: IVoucher[];
    addresses?: IUserAddress[];
    comparePassword(candidatePassword: string): Promise<boolean>;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: false
    },
    fullName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    },
    phone: String,
    address: String,
    avatar: {
        type: String
    },
    googleId: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: String,
    verificationCodeExpires: Date,
    totalSpent: {
        type: Number,
        default: 0
    },
    vipLevel: {
        type: Number,
        default: 1
    },
    vipRank: {
        type: String,
        enum: ['Đồng', 'Bạc', 'Vàng', 'Kim cương'],
        default: 'Đồng'
    },
    vouchers: [
        {
            type: {
                type: String,
                enum: ['discount', 'free_shipping'],
                required: true
            },
            value: {
                type: Number,
                required: true
            },
            status: {
                type: String,
                enum: ['active', 'used', 'expired'],
                default: 'active'
            },
            expiredAt: Date
        }
    ],
    addresses: [
        {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            addressLine: { type: String, required: true },
            ward: { type: String, required: true },
            district: { type: String, required: true },
            province: { type: String, required: true },
            isDefault: { type: Boolean, default: false }
        }
    ],
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password') || !this.password) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
