"use client";

import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import apiService from "@/services/api";
import { toast } from "react-toastify";
import { getUserInfo } from "@/api/auth.api";

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  receiver: {
    _id: string;
    name: string;
    email: string;
  };
  timestamp: string;
  isRead: boolean;
}

const Contact = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Admin ID - bạn cần thay thế bằng ID admin thật
  const adminId = "680999b959c8fcbccf330429";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUserInfo()
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (user?._id) {
      fetchMessages();
      fetchUnreadCount();
      const interval = setInterval(() => {
        fetchMessages();
        fetchUnreadCount();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      if (!user?._id) return;
      const response = await apiService.getChatHistory(user._id, adminId);
      setMessages(response);
    } catch (error) {
      console.error("Lỗi khi lấy tin nhắn:", error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      if (!user?._id) return;
      const response = await apiService.getUnreadCount(user._id);
      setUnreadCount(response.unreadCount);
    } catch (error) {
      console.error("Lỗi khi lấy số tin nhắn chưa đọc:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    console.log(newMessage);
    e.preventDefault();
    if (!newMessage.trim() || !user?._id) return;

    setIsLoading(true);
    try {
      await apiService.sendMessage(adminId, user._id, newMessage);
      setNewMessage("");
      fetchMessages();
      toast.success("Gửi tin nhắn thành công");
    } catch (error) {
      toast.error("Lỗi khi gửi tin nhắn");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-lg">Vui lòng đăng nhập để sử dụng chat</p>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb title={"Hỗ trợ trực tuyến"} pages={["hỗ trợ"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col xl:flex-row gap-7.5">
            {/* Thông tin liên hệ */}
            <div className="xl:max-w-[370px] w-full bg-white rounded-xl shadow-1">
              <div className="py-5 px-4 sm:px-7.5 border-b border-gray-3">
                <p className="font-medium text-xl text-dark">
                  Thông tin liên hệ
                </p>
              </div>

              <div className="p-4 sm:p-7.5">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex w-12 h-12 rounded-full bg-gray-1 items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z"
                          stroke="#292D32"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M3.62001 8.49C5.59001 -0.169998 18.42 -0.159998 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39001 20.54C5.63001 17.88 2.47001 13.57 3.62001 8.49Z"
                          stroke="#292D32"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>

                    <div>
                      <h4 className="font-medium text-dark mb-1">Địa chỉ</h4>
                      <p className="text-dark-2">123 Đường ABC, Quận XYZ, TP.HCM</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex w-12 h-12 rounded-full bg-gray-1 items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z"
                          stroke="#292D32"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7 8H17"
                          stroke="#292D32"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7 13H13"
                          stroke="#292D32"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <div>
                      <h4 className="font-medium text-dark mb-1">Email</h4>
                      <p className="text-dark-2">support@example.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex w-12 h-12 rounded-full bg-gray-1 items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z"
                          stroke="#292D32"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.9965 11H16.0054"
                          stroke="#292D32"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11.9955 11H12.0045"
                          stroke="#292D32"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.99451 11H8.00349"
                          stroke="#292D32"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <div>
                      <h4 className="font-medium text-dark mb-1">Điện thoại</h4>
                      <p className="text-dark-2">+84 123 456 789</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Khu vực chat */}
            <div className="flex-1 bg-white rounded-xl shadow-1">
              <div className="py-5 px-4 sm:px-7.5 border-b border-gray-3">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-xl text-dark">
                    Hỗ trợ trực tuyến
                  </p>
                  {unreadCount > 0 && (
                    <span className="px-2 py-1 text-sm bg-red-500 text-white rounded-full">
                      {unreadCount} tin nhắn mới
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-7.5">
                {/* Lịch sử tin nhắn */}
                <div className="h-[400px] overflow-y-auto mb-4 p-4 bg-gray-1 rounded-lg">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`mb-4 ${
                        message.sender._id === user._id ? "text-right" : "text-left"
                      }`}
                    >
                      <div
                        className={`inline-block p-3 rounded-lg ${
                          message.sender._id === user._id
                            ? "bg-blue text-white"
                            : "bg-gray-3 text-dark"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Form gửi tin nhắn */}
                <form onSubmit={handleSendMessage}>
                  <div className="flex gap-4">
                    <input
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Nhập tin nhắn của bạn..."
                      className="flex-1 rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex font-medium text-white text-custom-sm rounded-md bg-blue py-2.5 px-6 ease-out duration-200 hover:bg-blue-dark disabled:opacity-50"
                    >
                      {isLoading ? "Đang gửi..." : "Gửi"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
