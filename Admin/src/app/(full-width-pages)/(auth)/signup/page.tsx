import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | E-commerce Admin",
  description: "Create your E-commerce admin account",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
