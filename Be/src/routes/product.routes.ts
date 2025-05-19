import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware';
import { uploadImages } from '../middlewares/upload.middleware';
import { reviewProduct, updateReviewProduct, deleteReviewProduct } from '../controllers/product.controller';

const router = Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductDetail);
router.post('/:id/review', authenticateToken, (req, res, next) => reviewProduct(req, res).catch(next));
router.get('/:id/reviews', productController.getProductReviews);

// Admin routes
router.use((req: any, res: any, next: any) => {
    authenticateToken(req , res, next);
});

router.use((req: any, res: any, next: any) => {
    isAdmin(req, res, next)
})
router.post('/', uploadImages, (req: any, res: any, next: any) => {
    productController.createProduct(req , res).catch(next);
});
router.put('/:id', uploadImages, (req: any, res: any, next: any) => {
    productController.updateProduct(req , res).catch(next);
});
router.delete('/:id', productController.deleteProduct);
router.put('/:id/review', authenticateToken, (req, res, next) => updateReviewProduct(req, res).catch(next));
router.delete('/:id/review', authenticateToken, (req, res, next) => deleteReviewProduct(req, res).catch(next));

export default router; 