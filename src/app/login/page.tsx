import type { Metadata } from "next";
import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to book sessions, enroll in courses and manage your orders with Manisha Belvalkar.",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <AuthShell
      title={
        <>
          Welcome <span className="font-serif font-medium italic text-primary">back.</span>
        </>
      }
      subtitle="Sign in to manage your sessions, courses and private healing journey."
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
