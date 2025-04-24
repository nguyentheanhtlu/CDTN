import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
import { jwtConfig } from '../config/jwt.config';
import { generateVerificationCode } from '../middlewares/auth.middleware';
import { sendVerificationEmail } from '../services/email.service';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, fullName, phone, address } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được đăng ký' });
        }

        const verificationCode = generateVerificationCode();
        const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); 
        const user = await User.create({
            email,
            password,
            fullName,
            phone,
            address,
            verificationCode,
            verificationCodeExpires,
            isVerified: false
        });

        await sendVerificationEmail(email, verificationCode);

        res.status(201).json({
            message: 'Đăng ký thành công. Vui lòng kiểm tra email để lấy mã xác thực.',
            userId: user._id
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Lỗi trong quá trình đăng ký', 
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Email not verified' });
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const payload = { id: user._id };
        const options: SignOptions = { expiresIn: jwtConfig.expiresIn };
        const token = jwt.sign(payload, jwtConfig.secret, options);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { userId, code } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        if (!user.verificationCode || !user.verificationCodeExpires) {
            return res.status(400).json({ message: 'Verification code not found or expired' });

        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        if (user.verificationCodeExpires < new Date()) {
            return res.status(400).json({ message: 'Verification code expired' });
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        const payload = { id: user._id };
        const options: SignOptions = { expiresIn: jwtConfig.expiresIn };
        const token = jwt.sign(payload, jwtConfig.secret, options);

        res.json({
            message: 'Email verified successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying email', error });
    }
};

export const resendVerificationCode = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        const verificationCode = generateVerificationCode();
        const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        user.verificationCode = verificationCode;
        user.verificationCodeExpires = verificationCodeExpires;
        await user.save();

        await sendVerificationEmail(user.email, verificationCode);

        res.json({ message: 'Verification code sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error resending verification code', error });
    }
};