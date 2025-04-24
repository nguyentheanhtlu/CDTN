import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/user.model';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    // Kiểm tra xem user có tồn tại không
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized. Please login first.' });
    }

    const user = req.user as IUser;
    
    // Kiểm tra role admin
    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }

    return next();
};