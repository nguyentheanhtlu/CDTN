import express from 'express';
import { payWithVNPay, payWithMoMo, handleVNPayReturn, handleMoMoReturn, handleMomoCallback } from '../controllers/payment.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/vnpay', authenticateToken, payWithVNPay);
router.post('/momo', authenticateToken, payWithMoMo);
router.get('/vnpay_return', handleVNPayReturn);
router.get('/momo_return', handleMoMoReturn);
router.get('/momo/callback', handleMomoCallback);
export default router; 