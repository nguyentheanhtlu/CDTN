"use client";
import VerifyCodeForm from "@/components/auth/VerifyCodeForm";
import { useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "";

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Invalid Verification Link
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Please try signing up again.
          </p>
        </div>
      </div>
    );
  }

  return <VerifyCodeForm userId={userId} />;
} 