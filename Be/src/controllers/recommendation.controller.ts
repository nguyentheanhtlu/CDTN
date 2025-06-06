import { Request, Response } from 'express';
import { RecommendationService } from '../services/recommendation.service';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';

const recommendationService = new RecommendationService();

export class RecommendationController {
  // Lấy danh sách sản phẩm gợi ý cho người dùng
  public async getRecommendedProducts(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const limit = parseInt(req.query.limit as string) || 5;

      const [orders, products] = await Promise.all([
        Order.find().populate('items.product'),
        Product.find()
      ]);

      const recommendedProducts = await recommendationService.getRecommendedProducts(
        userId,
        orders,
        products,
        limit
      );

      res.json({
        success: true,
        data: recommendedProducts
      });
    } catch (error) {
      console.error('Error getting recommended products:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get recommended products'
      });
    }
  }

  // Lấy danh sách sản phẩm tương tự
  public async getSimilarProducts(req: Request, res: Response) {
    try {
      const productId = req.params.productId;
      const limit = parseInt(req.query.limit as string) || 5;

      const products = await Product.find();
      const similarProducts = await recommendationService.getSimilarProducts(
        productId,
        products,
        limit
      );

      res.json({
        success: true,
        data: similarProducts
      });
    } catch (error) {
      console.error('Error getting similar products:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get similar products'
      });
    }
  }
} 