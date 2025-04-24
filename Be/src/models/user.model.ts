import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

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
    comparePassword(candidatePassword: string): Promise<boolean>;
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
        type: String,
        default: 'default-avatar.png'
    },
    googleId: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: String,
    verificationCodeExpires: Date
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