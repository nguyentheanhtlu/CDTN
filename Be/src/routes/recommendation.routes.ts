import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendation.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const recommendationController = new RecommendationController();

// Lấy danh sách sản phẩm gợi ý cho người dùng
router.get(
  '/recommended/:userId',
  authenticateToken,
  recommendationController.getRecommendedProducts
);

// Lấy danh sách sản phẩm tương tự
router.get(
  '/similar/:productId',
  authenticateToken,
  recommendationController.getSimilarProducts
);

export default router; 