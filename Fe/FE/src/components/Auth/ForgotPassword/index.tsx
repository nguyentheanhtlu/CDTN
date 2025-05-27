"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import React, { useState } from "react";
import { forgotPassword } from "@/api/auth.api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Vui lòng nhập email của bạn");
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không thể gửi email khôi phục mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title={"Quên mật khẩu"} pages={["Quên mật khẩu"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Quên mật khẩu
              </h2>
              <p>Nhập email của bạn để nhận hướng dẫn khôi phục mật khẩu</p>
            </div>

            <div>
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                {error && <div className="text-red-500 text-sm mb-2 text-center">{error}</div>}
                {success && (
                  <div className="text-green-500 text-sm mb-2 text-center">
                    Đã gửi email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư của bạn.
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5"
                  disabled={loading}
                >
                  {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                </button>

                <p className="text-center mt-6">
                  Đã nhớ mật khẩu?
                  <Link
                    href="/signin"
                    className="text-dark ease-out duration-200 hover:text-blue pl-2"
                  >
                    Đăng nhập ngay
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword; 