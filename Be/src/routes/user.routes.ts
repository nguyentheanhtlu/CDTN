import { Router } from 'express';
import { getProfile, updateProfile, changePassword, updateAvatar, grantVoucherToUser, removeVoucherFromUser, getUserVouchers, getAllUsersWithVouchers, getUserVoucherHistory, getUserAddresses, addUserAddress, updateUserAddress, deleteUserAddress, setDefaultUserAddress, getAllUsers, getUserById } from '../controllers/user.controller';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Routes với authentication
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.put('/password', authenticateToken, changePassword);
router.put('/avatar', authenticateToken, upload.single('avatar'), updateAvatar);

// Address routes (chỉ cần authentication)
router.get('/addresses', authenticateToken, getUserAddresses);
router.post('/addresses', authenticateToken, addUserAddress);
router.put('/addresses/:id', authenticateToken, updateUserAddress);
router.delete('/addresses/:id', authenticateToken, deleteUserAddress);
router.put('/addresses/:id/default', authenticateToken, setDefaultUserAddress);

// Voucher routes (chỉ cần authentication)
router.get('/vouchers', authenticateToken, getUserVouchers);
router.get('/voucher-history', authenticateToken, getUserVoucherHistory);

// Admin routes
router.get('/admin/all-users', authenticateToken, isAdmin, getAllUsers);
router.get('/:id', authenticateToken, isAdmin, getUserById);
router.post('/:userId/voucher', authenticateToken, isAdmin, grantVoucherToUser);
router.delete('/:userId/voucher/:voucherId', authenticateToken, isAdmin, removeVoucherFromUser);
router.get('/admin/all-users-with-vouchers', authenticateToken, isAdmin, getAllUsersWithVouchers);

export default router; 