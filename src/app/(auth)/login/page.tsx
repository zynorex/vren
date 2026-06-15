import type { Metadata } from "next";
import { Suspense } from "react";
import LoginClient from "./login.client";

export const metadata: Metadata = {
  title: "Developer Login",
  description:
    "Sign in to the VREN developer dashboard using a secure, passwordless magic link.",
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginClient />
    </Suspense>
  );
}
