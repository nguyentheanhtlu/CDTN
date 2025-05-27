"use client";

import React, { useState } from "react";
import { verifyEmail } from "@/api/auth.api";

interface VerifyEmailProps {
  userId: string;
  onSuccess: () => void;
  onError?: (msg: string) => void;
  onBack?: () => void;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ userId, onSuccess, onError, onBack }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [animClass, setAnimClass] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAnimClass("");
    try {
      await verifyEmail(userId, code);
      setSuccess(true);
      setAnimClass("animate-bounce");
      showToast("success", "Email verified successfully!");
      setTimeout(() => {
        setAnimClass("");
        onSuccess();
      }, 700);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Verification failed";
      setError(msg);
      setAnimClass("animate-shake");
      showToast("error", msg);
      setTimeout(() => setAnimClass(""), 700);
      if (onError) onError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white text-base font-medium toast-fade ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {toast.message}
        </div>
      )}
      <div className="max-w-[400px] mx-auto bg-white p-6 rounded shadow" style={{ marginTop: 200 }}>
        <h3 className="text-lg font-semibold mb-2 text-center">Xác thực Email</h3>
        <p className="mb-4 text-center text-sm text-gray-600">Vui lòng nhập mã xác thực đã được gửi đến email của bạn.</p>
        <form onSubmit={handleSubmit} className={animClass}>
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Nhập mã xác thực"
            className="w-full mb-3 px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
            required
          />
          {error && <div className="text-red-500 text-sm mb-2 text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Đang xác thực..." : "Xác thực Email"}
          </button>
          {onBack && (
            <button
              type="button"
              className="w-full mt-2 text-gray-500 hover:underline text-sm"
              onClick={onBack}
              disabled={loading}
            >
              Quay lại
            </button>
          )}
          {success && <div className="text-green-600 text-center mt-2">Xác thực email thành công!</div>}
        </form>
        <style jsx global>{`
          @keyframes shake {
            10%, 90% { transform: translateX(-2px); }
            20%, 80% { transform: translateX(4px); }
            30%, 50%, 70% { transform: translateX(-8px); }
            40%, 60% { transform: translateX(8px); }
          }
          .animate-shake {
            animation: shake 0.7s;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            20% { transform: translateY(-10px); }
            40% { transform: translateY(-20px); }
            60% { transform: translateY(-10px); }
            80% { transform: translateY(-5px); }
          }
          .animate-bounce {
            animation: bounce 0.7s;
          }
          @keyframes toast-fade {
            0% { opacity: 0; transform: translateY(-20px) scale(0.95); }
            20% { opacity: 1; transform: translateY(0) scale(1); }
            80% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-20px) scale(0.95); }
          }
          .toast-fade {
            animation: toast-fade 2s;
          }
        `}</style>
      </div>
    </>
  );
};

export default VerifyEmail; 