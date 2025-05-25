import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import path from 'path';
import { databaseConfig } from './config/database.config';
import { configurePassport } from './config/passport.config';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import blogRoutes from './routes/blog.routes';
import categoryRoutes from './routes/category.routes';
import uploadRoutes from './routes/upload.routes';
import paymentRoutes from './routes/payment.routes';
import { createServer } from 'http';
import { Server } from 'socket.io';
import chatRoutes from './routes/chat.routes';
import { ChatService } from './services/chat.service';
import chatbotRoutes from './routes/chatbot.routes';
import adminRoutes from './routes/admin.routes'

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Configure Passport
configurePassport();

// Routes
app.use('/api/admin', adminRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/payment', paymentRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the E-commerce API' });
});

// Connect to MongoDB
mongoose.connect(databaseConfig.uri)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Thay đổi origin này theo domain của frontend của bạn
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Khởi tạo ChatService
new ChatService(io);

// Sử dụng httpServer thay vì app.listen
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});