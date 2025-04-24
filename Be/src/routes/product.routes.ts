import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware';
import { uploadImages } from '../middlewares/upload.middleware';

const router = Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductDetail);

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

export default router; 