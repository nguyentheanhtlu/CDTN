import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { forgotPassword, resetPassword } from '../controllers/auth.controller';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerificationCode);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;