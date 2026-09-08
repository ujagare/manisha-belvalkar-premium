import type { Metadata } from "next";
import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Join Manisha Belvalkar's inner circle — book sessions, enroll in courses and receive personal guidance.",
};

export default function SignupPage() {
  return (
    <AuthShell
      title={
        <>
          Begin your <span className="text-crimson-gradient">journey</span>
        </>
      }
      subtitle="Create your free account to book sessions, enroll in courses and access the community."
    >
      <Suspense>
        <SignupForm />
      </Suspense>
    </AuthShell>
  );
}
