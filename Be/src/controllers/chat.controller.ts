import { Request, Response } from 'express';
import Message from '../models/message.model';

export class ChatController {
  // Get chat history between two users
  async getChatHistory(req: any, res: any) {
    try {
      const { userId, adminId } = req.params;
      const messages = await Message.find({
        $or: [
          { sender: userId, receiver: adminId },
          { sender: adminId, receiver: userId }
        ]
      })
      .sort({ timestamp: 1 })
      .populate('sender', 'name email')
      .populate('receiver', 'name email');

      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching chat history' });
    }
  }

  // Get unread messages count
  async getUnreadCount(req: any, res: any) {
    try {
      const userId = req.params.userId;
      const count = await Message.countDocuments({
        receiver: userId,
        isRead: false
      });

      res.json({ unreadCount: count });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching unread count' });
    }
  }
}