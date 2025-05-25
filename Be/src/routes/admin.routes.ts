import { Router } from 'express';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware';
import { getAccounts } from '../controllers/admin.controller';

const router = Router();

// Routes với authentication
router.get('/accounts', authenticateToken, isAdmin, getAccounts);

export default router;