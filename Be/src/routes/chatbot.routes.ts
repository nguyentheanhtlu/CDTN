import { Router } from 'express';
import { chatWithGemini } from '../controllers/chatbot.controller';

const router = Router();
router.post('/ai', chatWithGemini);

export default router; 