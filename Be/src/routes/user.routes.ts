import { Router, Request, Response, NextFunction } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { uploadAvatar } from '../middlewares/upload.middleware';

const router = Router();

// Middleware để xác thực cho tất cả routes
router.use((req: Request, res: Response, next: NextFunction) => {
    authenticateToken(req as any, res, next);
});

// Cast request type để phù hợp với controller
router.get('/profile', (req: Request, res: Response, next: NextFunction) => {
    userController.getProfile(req as any, res).catch(next);
});

router.put('/profile', (req: Request, res: Response, next: NextFunction) => {
    userController.updateProfile(req as any, res).catch(next);
});

router.put('/change-password', (req: Request, res: Response, next: NextFunction) => {
    userController.changePassword(req as any, res).catch(next);
});

router.put('/avatar', uploadAvatar, (req: Request, res: Response, next: NextFunction) => {
    userController.updateAvatar(req as any, res).catch(next);
});

export default router; 