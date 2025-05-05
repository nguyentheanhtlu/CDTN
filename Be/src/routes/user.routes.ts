import { Router } from 'express';
import { getProfile, updateProfile, changePassword, updateAvatar, grantVoucherToUser, removeVoucherFromUser, getUserVouchers, getAllUsersWithVouchers, getUserVoucherHistory, getUserAddresses, addUserAddress, updateUserAddress, deleteUserAddress, setDefaultUserAddress } from '../controllers/user.controller';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Routes với authentication
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.put('/change-password', authenticateToken, changePassword);
router.put('/avatar', authenticateToken, upload.single('avatar'), updateAvatar);
router.post('/:userId/voucher', authenticateToken, isAdmin, grantVoucherToUser);
router.delete('/:userId/voucher/:voucherIndex', authenticateToken, isAdmin, removeVoucherFromUser);
router.get('/:userId/vouchers', authenticateToken, getUserVouchers);
router.get('/admin/all-users-with-vouchers', authenticateToken, isAdmin, getAllUsersWithVouchers);
router.get('/:userId/voucher-history', authenticateToken, getUserVoucherHistory);
router.get('/addresses', authenticateToken, getUserAddresses);
router.post('/addresses', authenticateToken, addUserAddress);
router.put('/addresses/:index', authenticateToken, updateUserAddress);
router.delete('/addresses/:index', authenticateToken, deleteUserAddress);
router.put('/addresses/:index/default', authenticateToken, setDefaultUserAddress);

export default router; 