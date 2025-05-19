import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | E-commerce Admin",
  description: "Sign in to your E-commerce admin dashboard",
};

export default function SignIn() {
  return <SignInForm />;
}
