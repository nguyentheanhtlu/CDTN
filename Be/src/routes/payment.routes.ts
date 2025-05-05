import { Router } from 'express';
import { payWithVNPay, payWithMoMo, handleVNPayReturn } from '../controllers/payment.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/vnpay', authenticateToken, payWithVNPay);
router.post('/momo', authenticateToken, payWithMoMo);
router.get('/vnpay_return', handleVNPayReturn);

export default router; 