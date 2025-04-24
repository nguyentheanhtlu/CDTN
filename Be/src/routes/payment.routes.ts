import { Router } from 'express';
import { payWithVNPay, payWithMoMo } from '../controllers/payment.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/vnpay', authenticateToken, payWithVNPay);
router.post('/momo', authenticateToken, payWithMoMo);

export default router; 