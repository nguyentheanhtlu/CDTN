import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
import { jwtConfig } from '../config/jwt.config';

export const googleCallback = async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser;
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        const payload = { id: user._id };
        const options: SignOptions = { expiresIn: jwtConfig.expiresIn };
        const token = jwt.sign(payload, jwtConfig.secret, options);

        // Redirect to frontend with token
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/auth/google/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role
        }))}`);
    } catch (error) {
        res.status(500).json({ message: 'Error in Google authentication', error });
    }
}; 