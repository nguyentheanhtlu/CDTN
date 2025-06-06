import express from 'express';
import { ChatController } from '../controllers/chat.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();
const chatController = new ChatController();

// Get chat history
router.get('/:userId/:adminId', authenticateToken, chatController.getChatHistory);

// Get unread count
router.get('/unread/:userId', authenticateToken, chatController.getUnreadCount);

// Send message
router.post('/send', authenticateToken, chatController.sendMessage);

// Mark messages as read
router.put('/read/:userId/:adminId', authenticateToken, chatController.markAsRead);

export default router;