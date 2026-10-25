"use client";

import Link from "next/link";
import { MdEmail } from "react-icons/md";
import AuthResetLayout from "../shared/auth-reset-layout/AuthResetLayout";
import AppForm from "../shared/app-form/AppForm";
import AppInput from "../shared/app-input/AppInput";
import { FormField } from "../shared/app-form/app_form.interface";
import { $SCHEMAS_REPOSITORY } from "@/schemas/schemas.repo";

export default function ForgotPasswordForm({
  onSubmit,
}: {
  onSubmit: (data: { email: string }) => void;
}) {
  const fields: FormField[] = [
    {
      name: "email",
      type: "input",
      label: "Email Address",
      placeholder: "Enter your email address",
      props: {
        type: "email",
        autoComplete: "email",
        className: "rounded-xl border-border",
        icon: <MdEmail className="size-4 text-muted-foreground/70" />,
        position: "start",
      },
    },
  ];

  return (
    <AuthResetLayout
      step={1}
      title="Forgot Password?"
      subtitle="No worries, we'll send you a reset code"
      backAction={{ label: "Back to Sign In", href: "/signin" }}
      footerText={
        <>
          Remember your password?{" "}
          <Link href="/signin" className="font-semibold text-main-color hover:underline">
            Sign In
          </Link>
        </>
      }
    >
      <AppForm
        fields={fields}
        components={{ input: AppInput }}
        onSubmit={onSubmit}
        buttonText="Send Reset Code"
        formClassName="space-y-4"
        schema={$SCHEMAS_REPOSITORY.FORGOT_PASSWORD_FORM}
      />
    </AuthResetLayout>
  );
}
