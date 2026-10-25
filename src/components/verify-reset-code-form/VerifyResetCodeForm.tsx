"use client";

import { FaShieldAlt } from "react-icons/fa";
import AuthResetLayout from "../shared/auth-reset-layout/AuthResetLayout";
import AppForm from "../shared/app-form/AppForm";
import AppInput from "../shared/app-input/AppInput";
import { FormField } from "../shared/app-form/app_form.interface";
import { $SCHEMAS_REPOSITORY } from "@/schemas/schemas.repo";

interface VerifyResetCodeProps {
  email: string;
  onSubmit: (data: { otp: string }) => void;
  onResendCode?: () => void;
  onChangeEmail?: () => void;
  resendLabel?: string;
  resendDisabled?: boolean;
}

export default function VerifyResetCodeForm({
  email,
  onSubmit,
  onResendCode,
  onChangeEmail,
  resendLabel = "Resend Code",
  resendDisabled = false,
}: VerifyResetCodeProps) {
  const fields: FormField[] = [
    {
      name: "otp",
      type: "input",
      label: "Verification Code",
      placeholder: "••••••",
      props: {
        type: "text",
        inputMode: "numeric",
        maxLength: 6,
        className: "rounded-xl tracking-widest text-center text-lg font-mono border-border",
        icon: <FaShieldAlt className="size-4 text-muted-foreground/70" />,
        position: "start",
      },
    },
  ];

  return (
    <AuthResetLayout
      step={2}
      title="Check Your Email"
      subtitle={`Enter the 6-digit code sent to ${email}`}
      backAction={{ label: "Change email address", onClick: onChangeEmail }}
    >
      <AppForm
        fields={fields}
        components={{ input: AppInput }}
        onSubmit={onSubmit}
        buttonText="Verify Code"
        formClassName="space-y-4"
        schema={$SCHEMAS_REPOSITORY.VERIFY_RESET_CODE_FORM}
      >
        <div className="text-center text-xs text-muted-foreground mt-2">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={onResendCode}
            disabled={resendDisabled}
            className="font-semibold text-main-color hover:underline disabled:text-muted-foreground/70 disabled:no-underline cursor-pointer"
          >
            {resendLabel}
          </button>
        </div>
      </AppForm>
    </AuthResetLayout>
  );
}
