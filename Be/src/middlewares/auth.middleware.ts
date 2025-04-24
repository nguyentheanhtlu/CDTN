import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';
import { User, IUser } from '../models/user.model';

export const generateVerificationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Access token not found' });
        }

        const decoded = jwt.verify(token, jwtConfig.secret) as { id: string };
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Email not verified' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser;
    if (user?.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Requires admin privileges' });
    }
};