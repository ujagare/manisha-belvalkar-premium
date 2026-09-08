import type { Metadata } from "next";
import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to book sessions, enroll in courses and manage your orders with Manisha Belvalkar.",
};

export default function LoginPage() {
  return (
    <AuthShell
      title={
        <>
          Welcome <span className="text-crimson-gradient">back</span>
        </>
      }
      subtitle="Sign in to book sessions, enroll in courses, and continue your journey."
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
