import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authenticateToken , isAdmin } from '../middlewares/auth.middleware';

const router = Router();

// User routes (yêu cầu đăng nhập)
router.use((req: any, res: any, next: any) => {
    authenticateToken(req, res , next);
});
router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getUserOrders);
router.get('/:id', orderController.getOrderDetail);
router.get('/:orderId/payment-status', orderController.checkPaymentStatus);
router.post('/:orderId/update-payment', orderController.updatePaymentStatus);

// Admin routes
router.use((req: any, res: any, next: any) => {
    isAdmin(req, res, next);
});
router.get('/', orderController.getAllOrders);
router.put('/:id/status', orderController.updateOrderStatus);

export default router; 