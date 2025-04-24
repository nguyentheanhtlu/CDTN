import { Server, Socket } from 'socket.io';
import Message, { IMessage } from '../models/message.model';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';
import { User, IUser } from '../models/user.model';
import { Document, Types } from 'mongoose';

export class ChatService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on('connection', async (socket: Socket) => {
      try {
        // Verify user token
        const token = socket.handshake.auth.token;
        if (!token) {
          socket.disconnect();
          return;
        }

        const decoded = jwt.verify(token, jwtConfig.secret) as { id: string };
        const user = await User.findById(decoded.id) as IUser & { _id: Types.ObjectId };
        
        if (!user || !user.isVerified) {
          socket.disconnect();
          return;
        }

        // Join user to their personal room
        socket.join(user._id.toString());

        // Handle new message
        socket.on('send_message', async (data: {
          receiverId: string;
          content: string;
        }) => {
          try {
            const message = await Message.create({
              sender: user._id,
              receiver: data.receiverId,
              content: data.content
            });

            // Emit to sender and receiver
            this.io.to(user._id.toString()).emit('new_message', message)
            this.io.to(data.receiverId).emit('new_message', message);
          } catch (error) {
            console.error('Error sending message:', error);
          }
        });

        // Handle message read status
        socket.on('mark_as_read', async (messageId: string) => {
          try {
            await Message.findByIdAndUpdate(messageId, { isRead: true });
            socket.emit('message_read', messageId);
          } catch (error) {
            console.error('Error marking message as read:', error);
          }
        });

        // Handle disconnect
        socket.on('disconnect', () => {
          socket.leave(user._id.toString());
        });
      } catch (error) {
        console.error('Socket connection error:', error);
        socket.disconnect();
      }
    });
  }
}