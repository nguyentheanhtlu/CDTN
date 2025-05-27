import React, { useState, useRef, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/chatbot/ai'; // Đảm bảo đúng port backend

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ from: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: { from: 'user' | 'bot'; text: string } = { from: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages((msgs) => [...msgs, { from: 'bot', text: data.reply }]);
    } catch (e) {
      setMessages((msgs) => [...msgs, { from: 'bot', text: 'Lỗi kết nối chatbot.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <>
      {/* Messenger Icon */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#1976d2',
            boxShadow: '0 2px 12px #0002',
            border: 'none',
            zIndex: 1001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          aria-label="Mở chatbot"
        >
          {/* Messenger SVG icon */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#fff"/>
            <path d="M16 6C10.477 6 6 10.01 6 14.98c0 2.44 1.19 4.63 3.16 6.19v4.01c0 .27.22.49.49.49.1 0 .2-.03.28-.09l3.56-2.67c.83.23 1.7.36 2.61.36 5.523 0 10-4.01 10-8.98S21.523 6 16 6zm1.13 11.47l-2.13-2.27-4.13 2.27 5.13-5.47 2.13 2.27 4.13-2.27-5.13 5.47z" fill="#1976d2"/>
          </svg>
        </button>
      )}

      {/* Chatbox */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, width: 350, background: '#fff',
          border: '1px solid #eee', borderRadius: 12, boxShadow: '0 2px 12px #0001', zIndex: 1000
        }}>
          <div style={{ padding: 16, borderBottom: '1px solid #eee', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Chatbot AI Gemini</span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }} aria-label="Đóng">×</button>
          </div>
          <div style={{ maxHeight: 320, overflowY: 'auto', padding: 16 }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ textAlign: msg.from === 'user' ? 'right' : 'left', margin: '8px 0' }}>
                <span style={{ display: 'inline-block', background: msg.from === 'user' ? '#e0f7fa' : '#f1f8e9', padding: '8px 12px', borderRadius: 8 }}>
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div style={{ display: 'flex', borderTop: '1px solid #eee', padding: 8 }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi..."
              style={{ flex: 1, border: 'none', outline: 'none', padding: 8 }}
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ marginLeft: 8, padding: '0 16px', border: 'none', background: '#1976d2', color: '#fff', borderRadius: 8 }}>
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot; 