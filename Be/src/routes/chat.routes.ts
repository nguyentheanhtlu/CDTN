import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const chatController = new ChatController();

// Get chat history between user and admin
router.get('/history/:userId/:adminId', authenticateToken, chatController.getChatHistory);

// Get unread messages count
router.get('/unread/:userId', authenticateToken, chatController.getUnreadCount);

// Send new message
router.post('/message', authenticateToken, chatController.sendMessage);

export default router;