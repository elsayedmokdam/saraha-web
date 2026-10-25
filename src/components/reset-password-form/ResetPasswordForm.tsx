"use client";

import { FaLock } from "react-icons/fa";
import { FormField } from "../shared/app-form/app_form.interface";
import AuthResetLayout from "../shared/auth-reset-layout/AuthResetLayout";
import AppForm from "../shared/app-form/AppForm";
import AppInput from "../shared/app-input/AppInput";
import { $SCHEMAS_REPOSITORY } from "@/schemas/schemas.repo";

export default function ResetPasswordForm({
  onSubmit,
}: {
  onSubmit: (data: { newPassword: string; confirmPassword: string }) => void;
}) {
  const field = (name: string, label: string, placeholder: string): FormField => ({
    name,
    type: "input",
    label,
    placeholder,
    props: {
      type: "password",
      autoComplete: "new-password",
      className: "rounded-xl border-border",
      icon: <FaLock className="size-4 text-muted-foreground/70" />,
      position: "start",
    },
  });

  return (
    <AuthResetLayout
      step={3}
      title="Create New Password"
      subtitle="Your new password must be different from previous passwords"
    >
      <AppForm
        fields={[
          field("newPassword", "New Password", "Enter new password"),
          field("confirmPassword", "Confirm Password", "Repeat the new password"),
        ]}
        components={{ input: AppInput }}
        onSubmit={onSubmit}
        buttonText="Reset Password"
        formClassName="space-y-4"
        layoutClassName="space-y-4"
        schema={$SCHEMAS_REPOSITORY.RESET_PASSWORD_FORM}
      />
    </AuthResetLayout>
  );
}
