import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Reset your password for your Manisha Belvalkar account.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title={
        <>
          Reset your <span className="text-crimson-gradient">password</span>
        </>
      }
      subtitle="Enter your email and we'll send you a secure link to choose a new password."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
