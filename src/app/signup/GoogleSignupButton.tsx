"use client";

import AppButton from "@/components/shared/app-button/AppButton";
import { signIn } from "next-auth/react";

/** POST /auth/signup-with-gmail signs the user up (or logs them in if the Google account already exists). */
export default function GoogleSignupButton({ icon }: { icon: React.ReactNode }) {
  return (
    <AppButton
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="flex items-center justify-center gap-2 border border-border bg-card text-sm text-muted-foreground hover:bg-muted/50 transition duration-200 w-full py-5 rounded-xl"
    >
      {icon}
      Sign up with Google
    </AppButton>
  );
}
