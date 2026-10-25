"use client";

import ForgotPasswordForm from "@/components/forget-password-form/ForgetPasswordForm";
import ResetPasswordForm from "@/components/reset-password-form/ResetPasswordForm";
import VerifyResetCodeForm from "@/components/verify-reset-code-form/VerifyResetCodeForm";
import {
  forgotPasswordAction,
  resetPasswordAction,
  verifyResetPasswordOtpAction,
} from "@/services/actions/auth.action";
import { notify } from "@/services/utils/helpers/alerts";
import { useCooldown } from "@/hooks/useCooldown";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  // the reset endpoint verifies the OTP again, so it is kept for step 3
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const cooldown = useCooldown(120);

  // Step 1: POST /auth/forgot-password
  const handleSendCode = async (data: { email: string }) => {
    const response = await forgotPasswordAction(data);
    if (!response.ok) return notify.apiError(response.error);

    notify.success(response.data.message || "Code sent successfully");
    setEmail(data.email);
    cooldown.start();
    setStep(2);
  };

  const handleResend = async () => {
    const response = await forgotPasswordAction({ email });
    if (!response.ok) return notify.apiError(response.error);
    notify.success(response.data.message);
    cooldown.start();
  };

  // Step 2: POST /auth/verify-reset-password-otp
  const handleVerifyCode = async (data: { otp: string }) => {
    const response = await verifyResetPasswordOtpAction({ email, otp: data.otp });
    if (!response.ok) return notify.apiError(response.error);

    notify.success(response.data.message || "Code verified successfully");
    setOtp(data.otp);
    setStep(3);
  };

  // Step 3: PATCH /auth/reset-password
  const handleResetPassword = async (data: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    const response = await resetPasswordAction({ email, otp, ...data });
    if (!response.ok) return notify.apiError(response.error);

    notify.success(response.data.message || "Password reset successfully");
    router.push(`/signin?email=${encodeURIComponent(email)}`);
  };

  return (
    <main>
      {step === 1 && <ForgotPasswordForm onSubmit={handleSendCode} />}

      {step === 2 && (
        <VerifyResetCodeForm
          email={email}
          onSubmit={handleVerifyCode}
          onResendCode={handleResend}
          resendDisabled={cooldown.active}
          resendLabel={cooldown.active ? `Resend in ${cooldown.remaining}s` : "Resend Code"}
          onChangeEmail={() => setStep(1)}
        />
      )}

      {step === 3 && <ResetPasswordForm onSubmit={handleResetPassword} />}
    </main>
  );
}
