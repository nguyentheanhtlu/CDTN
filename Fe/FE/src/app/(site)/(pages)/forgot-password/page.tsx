import ForgotPassword from "@/components/Auth/ForgotPassword";
import React from "react";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Signup Page | NextCommerce Nextjs E-commerce template",
  description: "This is Signup Page for NextCommerce Template",
};

const ForgotPasswordPage = () => {
  return (
    <main>
      <ForgotPassword />
    </main>
  );
};

export default ForgotPasswordPage;
