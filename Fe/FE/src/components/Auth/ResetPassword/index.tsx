"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import React, { useState } from "react";
import { resetPassword } from "@/api/auth.api";
import { useRouter, useSearchParams } from "next/navigation";

const ResetPassword = () => {
  const [form, setForm] = useState({
    password: "",
    retype: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.password || !form.retype) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (form.password !== form.retype) {
      setError("Mật khẩu không khớp");
      setForm({ password: "", retype: "" });
      const passwordInput = document.getElementById("password");
      if (passwordInput) passwordInput.focus();
      return;
    }
    if (!token) {
      setError("Token không hợp lệ");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, form.password);
      router.push("/signin");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không thể đặt lại mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title={"Đặt lại mật khẩu"} pages={["Đặt lại mật khẩu"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Đặt lại mật khẩu
              </h2>
              <p>Nhập mật khẩu mới của bạn</p>
            </div>

            <div>
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5">
                    Mật khẩu mới <span className="text-red">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Nhập mật khẩu mới"
                    value={form.password}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="retype" className="block mb-2.5">
                    Nhập lại mật khẩu <span className="text-red">*</span>
                  </label>
                  <input
                    type="password"
                    name="retype"
                    id="retype"
                    placeholder="Nhập lại mật khẩu mới"
                    value={form.retype}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                {error && <div className="text-red-500 text-sm mb-2 text-center">{error}</div>}

                <button
                  type="submit"
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5"
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                </button>

                <p className="text-center mt-6">
                  <Link
                    href="/signin"
                    className="text-dark ease-out duration-200 hover:text-blue"
                  >
                    Quay lại đăng nhập
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

export default ResetPassword; 