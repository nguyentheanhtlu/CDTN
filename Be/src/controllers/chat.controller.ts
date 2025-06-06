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

  // Send new message
  async sendMessage(req: any, res: any) {
    try {
      const { senderId, receiverId, content } = req.body;

      if (!senderId || !receiverId || !content) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const message = await Message.create({
        sender: senderId,
        receiver: receiverId,
        content,
        timestamp: new Date(),
        isRead: false
      });

      // Populate sender and receiver details
      await message.populate('sender', 'name email');
      await message.populate('receiver', 'name email');

      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: 'Error sending message' });
    }
  }

  // Mark messages as read
  async markAsRead(req: any, res: any) {
    try {
      const { userId, adminId } = req.params;
      
      await Message.updateMany(
        {
          sender: adminId,
          receiver: userId,
          isRead: false
        },
        {
          $set: { isRead: true }
        }
      );

      res.json({ message: 'Messages marked as read' });
    } catch (error) {
      res.status(500).json({ message: 'Error marking messages as read' });
    }
  }
}