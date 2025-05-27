"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import React, { useState } from "react";
import { register } from "@/api/auth.api";
import VerifyEmail from "../VerifyEmail";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    retype: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [showVerify, setShowVerify] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name === "re-type-password" ? "retype" : e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password || !form.retype) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (form.password !== form.retype) {
      setError("Mật khẩu không khớp");
      return;
    }
    setLoading(true);
    try {
      const res = await register({ email: form.email, password: form.password, fullName: form.name });
      // Giả sử API trả về userId trong res.data.userId
      setUserId(res.data.userId || res.data.id || res.data._id);
      setShowVerify(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (showVerify && userId) {
    return (
      <VerifyEmail
        userId={userId}
        onSuccess={() => {
          setShowVerify(false);
          router.push("/signin");
        }}
        onBack={() => setShowVerify(false)}
        onError={msg => setError(msg)}
      />
    );
  }

  return (
    <>
      <Breadcrumb title={"Đăng ký"} pages={["Đăng ký"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Tạo tài khoản
              </h2>
              <p>Nhập thông tin của bạn bên dưới</p>
            </div>

            <div className="flex flex-col gap-4.5">
              <button className="flex justify-center items-center gap-3.5 rounded-lg border border-gray-3 bg-gray-1 p-3 ease-out duration-200 hover:bg-gray-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_98_7461)">
                    <mask
                      id="mask0_98_7461"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="20"
                      height="20"
                    >
                      <path d="M20 0H0V20H20V0Z" fill="white" />
                    </mask>
                    <g mask="url(#mask0_98_7461)">
                      <path
                        d="M19.999 10.2218C20.0111 9.53429 19.9387 8.84791 19.7834 8.17737H10.2031V11.8884H15.8267C15.7201 12.5391 15.4804 13.162 15.1219 13.7195C14.7634 14.2771 14.2935 14.7578 13.7405 15.1328L13.7209 15.2571L16.7502 17.5568L16.96 17.5774C18.8873 15.8329 19.999 13.2661 19.999 10.2218Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M10.2036 20C12.9586 20 15.2715 19.1111 16.9609 17.5777L13.7409 15.1332C12.8793 15.7223 11.7229 16.1333 10.2036 16.1333C8.91317 16.126 7.65795 15.7206 6.61596 14.9746C5.57397 14.2287 4.79811 13.1802 4.39848 11.9777L4.2789 11.9877L1.12906 14.3766L1.08789 14.4888C1.93622 16.1457 3.23812 17.5386 4.84801 18.512C6.45791 19.4852 8.31194 20.0005 10.2036 20Z"
                        fill="#34A853"
                      />
                      <path
                        d="M4.39899 11.9776C4.1758 11.3411 4.06063 10.673 4.05807 9.9999C4.06218 9.3279 4.1731 8.66067 4.38684 8.02221L4.38115 7.88959L1.1927 5.46234L1.0884 5.51095C0.372762 6.90337 0 8.44075 0 9.99983C0 11.5589 0.372762 13.0962 1.0884 14.4887L4.39899 11.9776Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M10.2039 3.86663C11.6661 3.84438 13.0802 4.37803 14.1495 5.35558L17.0294 2.59997C15.1823 0.90185 12.7364 -0.0298855 10.2039 -3.67839e-05C8.31239 -0.000477835 6.45795 0.514733 4.84805 1.48799C3.23816 2.46123 1.93624 3.85417 1.08789 5.51101L4.38751 8.02225C4.79107 6.82005 5.5695 5.77231 6.61303 5.02675C7.65655 4.28119 8.91254 3.87541 10.2039 3.86663Z"
                        fill="#EB4335"
                      />
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_98_7461">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                Đăng ký bằng Google
              </button>
            </div>

            <span className="relative z-1 block font-medium text-center mt-4.5">
              <span className="block absolute -z-1 left-0 top-1/2 h-px w-full bg-gray-3"></span>
              <span className="inline-block px-3 bg-white">Hoặc</span>
            </span>

            <div className="mt-5.5">
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="name" className="block mb-2.5">
                    Họ và tên <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Nhập họ và tên của bạn"
                    value={form.name}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2.5">
                    Địa chỉ email <span className="text-red">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Nhập địa chỉ email của bạn"
                    value={form.email}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5">
                    Mật khẩu <span className="text-red">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Nhập mật khẩu của bạn"
                    autoComplete="on"
                    value={form.password}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5.5">
                  <label htmlFor="re-type-password" className="block mb-2.5">
                    Nhập lại mật khẩu <span className="text-red">*</span>
                  </label>
                  <input
                    type="password"
                    name="re-type-password"
                    id="re-type-password"
                    placeholder="Nhập lại mật khẩu của bạn"
                    autoComplete="on"
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
                  {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                </button>

                <p className="text-center mt-6">
                  Đã có tài khoản?
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

export default Signup;