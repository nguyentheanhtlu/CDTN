import ResetPassword from "@/components/Auth/ResetPassword";

import React from "react";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Signup Page | NextCommerce Nextjs E-commerce template",
  description: "This is Signup Page for NextCommerce Template",
  // other metadata
};

const ResetPasswordPage = () => {
  return (
    <main>
      <ResetPassword />
    </main>
  );
};

export default ResetPasswordPage;
