"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ApiSignIn from "@/api/login";

export default function VerifyCodeForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await ApiSignIn.verifyEmail(userId, code);
      if (response.data.success) {
        router.push("/signin"); // Chuyển đến trang đăng nhập sau khi xác thực thành công
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Verify Your Email
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please enter the verification code sent to your email
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 text-sm text-error-500">{error}</div>
            )}
            <div className="space-y-6">
              <div>
                <Label>
                  Verification Code <span className="text-error-500">*</span>{" "}
                </Label>
                <Input
                  name="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter verification code"
                  type="text"
                  required
                />
              </div>
              <div>
                <Button
                  type="submit"
                  className="w-full"
                  size="sm"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 