import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import UpdatePasswordForm from "@/components/auth/UpdatePasswordForm";

export const metadata: Metadata = {
  title: "Set new password",
  description: "Choose a new password for your account.",
};

/**
 * Password reset landing — reached from the reset email. The Supabase
 * session is a recovery session, so updateUser() may set the password.
 */
export default function UpdatePasswordPage() {
  return (
    <AuthShell
      title={
        <>
          Choose a new <span className="text-crimson-gradient">password</span>
        </>
      }
      subtitle="Your new password should be at least 6 characters."
    >
      <UpdatePasswordForm />
    </AuthShell>
  );
}
