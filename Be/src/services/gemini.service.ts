import { GoogleGenAI } from "@google/genai";

export async function askGemini(prompt: string, apiKey: string): Promise<string> {
  const genAI = new GoogleGenAI({ apiKey });
  // Dùng models.generateContent trực tiếp
  const result = await genAI.models.generateContent({
    model: "gemini-2.0-flash", // hoặc "gemini-pro"
    contents: [{ role: "user", parts: [{ text: prompt }] }]
  });
  // Lấy text trả lời từ response
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || result?.text || 'Xin lỗi, tôi chưa có câu trả lời.';
  return text;
}