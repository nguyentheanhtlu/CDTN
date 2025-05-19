import { Request, Response } from 'express';
import { askGemini } from '../services/gemini.service';
import { enrichPromptWithData } from '../services/intent.service';

export const chatWithGemini = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyDwfr-d88bcSGT2Pjp7o3ayuPVIUIO3woM';
    if (!apiKey) return res.status(500).json({ message: 'Thiếu API key Gemini' });
    if (!message) return res.status(400).json({ message: 'Thiếu nội dung tin nhắn' });

    // Phân tích ý định và enrich prompt nếu cần
    const enrichedPrompt = await enrichPromptWithData(message);
    const promptToSend = enrichedPrompt || message;

    const reply = await askGemini(promptToSend, apiKey);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi chat với Gemini', error });
  }
}; 