import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken, isAdmin);

router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);
router.get('/', categoryController.getCategories);

export default router; 