import { Router } from 'express';
import { payWithVNPay, payWithMoMo, handleVNPayReturn, handleMoMoReturn } from '../controllers/payment.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/vnpay', authenticateToken, payWithVNPay);
router.post('/momo', authenticateToken, payWithMoMo);
router.get('/vnpay_return', handleVNPayReturn);
router.get('/momo_return', handleMoMoReturn);
export default router; 