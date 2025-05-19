import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Tất cả routes yêu cầu đăng nhập

router.use((req: any, res: any, next: any) => {
    authenticateToken(req , res, next);
});
router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/update', cartController.updateCartItem);
router.delete('/:productId', cartController.removeFromCart);

export default router; 