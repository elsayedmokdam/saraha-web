"use client";
import { useMemo, useState } from "react";
import AppForm from "../shared/app-form/AppForm";
import { FaEye, FaEyeSlash, FaGoogle, FaLock } from "react-icons/fa6";
import { FaShieldAlt } from "react-icons/fa";
import { FormField } from "../shared/app-form/app_form.interface";
import AppInput from "../shared/app-input/AppInput";
import { MdEmail } from "react-icons/md";
import { $SCHEMAS_REPOSITORY } from "@/schemas/schemas.repo";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { notify } from "@/services/utils/helpers/alerts";
import { safeRedirect } from "@/services/utils/helpers/safeRedirect";
import { twoFALoginAction } from "@/services/actions/auth.action";
import Link from "next/link";
import { useEffect } from "react";
import AppButton from "../shared/app-button/AppButton";

interface SigninFormProps {
  callbackUrl?: string;
  /** error forwarded by NextAuth / the Google flow through `?error=` */
  initialError?: string;
  defaultEmail?: string;
  googleEnabled: boolean;
}

export default function SigninForm({
  callbackUrl,
  initialError,
  defaultEmail,
  googleEnabled,
}: SigninFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [use2FA, setUse2FA] = useState(false);
  // step 2 of two-step verification
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (initialError) notify.error(initialError);
  }, [initialError]);

  const fields: FormField[] = useMemo(
    () => [
      {
        name: "email",
        type: "input",
        label: "Email*",
        placeholder: "you@example.com",
        props: {
          type: "email",
          autoComplete: "email",
          className: "rounded-xl",
          icon: <MdEmail className="size-4 text-muted-foreground/70" />,
          iconPosition: "start",
        },
      },
      {
        name: "password",
        type: "input",
        label: "Password*",
        placeholder: "••••••••",
        props: {
          type: showPassword ? "text" : "password",
          autoComplete: "current-password",
          className: "rounded-xl",
          icon: <FaLock className="size-4 text-muted-foreground/70" />,
          position: "start",
          endIcon: (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted cursor-pointer"
            >
              {showPassword ? (
                <FaEyeSlash className="size-4" />
              ) : (
                <FaEye className="size-4" />
              )}
            </button>
          ),
          endIconClassName: "pr-0",
        },
      },
    ],
    [showPassword],
  );

  const otpFields: FormField[] = [
    {
      name: "otp",
      type: "input",
      label: "Verification code",
      placeholder: "••••••",
      props: {
        type: "text",
        inputMode: "numeric",
        maxLength: 6,
        autoComplete: "one-time-code",
        className: "rounded-xl tracking-widest text-center text-lg font-mono",
        icon: <FaShieldAlt className="size-4 text-muted-foreground/70" />,
        position: "start",
      },
    },
  ];

  function handleSigninError(message: string, email: string) {
    notify.error(message);
    if (/confirm email/i.test(message)) setUnconfirmedEmail(email);
  }

  async function finish(message?: string) {
    notify.success(message ?? "Signed in successfully!");
    router.push(safeRedirect(callbackUrl));
    router.refresh();
  }

  // Step 1: email + password (plain login, or the first step of two-step verification)
  async function onSubmit(data: { email: string; password: string }) {
    setUnconfirmedEmail(null);

    if (use2FA) {
      // POST /auth/2fa/login => the API emails an OTP
      const res = await twoFALoginAction(data);
      if (!res.ok)
        return handleSigninError(
          res.error.issues?.[0] ?? res.error.message,
          data.email,
        );
      notify.success(res.data.message);
      setPendingEmail(data.email);
      return;
    }

    // POST /auth/login (through NextAuth's credentials provider)
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) return handleSigninError(res.error, data.email);
    await finish();
  }

  // Step 2: OTP => POST /auth/2fa/verify-otp (through NextAuth's credentials provider)
  async function onSubmitOtp(data: { otp: string }) {
    const res = await signIn("credentials", {
      email: pendingEmail,
      otp: data.otp,
      mode: "2fa",
      redirect: false,
    });

    if (res?.error) return notify.error(res.error);
    await finish();
  }

  function handleGoogleLogin() {
    void signIn("google", {
      callbackUrl: safeRedirect(callbackUrl),
    });
  }

  if (pendingEmail) {
    return (
      <>
        <p className="mb-5 text-center text-sm text-muted-foreground">
          Enter the 6-digit code we sent to{" "}
          <span className="font-semibold text-foreground">{pendingEmail}</span>.
          It expires in 2 minutes.
        </p>
        <AppForm
          key="otp"
          fields={otpFields}
          components={{ input: AppInput }}
          onSubmit={onSubmitOtp}
          buttonText="Verify & sign in"
          schema={$SCHEMAS_REPOSITORY.TWO_FA_OTP_FORM}
        />
        <button
          type="button"
          onClick={() => setPendingEmail(null)}
          className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-main-color cursor-pointer"
        >
          ← Back to credentials
        </button>
      </>
    );
  }

  return (
    <>
      {googleEnabled && (
        <>
          <AppButton
            type="button"
            onClick={handleGoogleLogin}
            className="my-5 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-5 text-sm text-muted-foreground transition duration-200 hover:bg-muted/50"
          >
            <FaGoogle className="h-4 w-4 text-red-600 dark:text-red-300" />
            Continue with Google
          </AppButton>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <p className="text-sm text-muted-foreground">
              or continue with email
            </p>
            <div className="h-px flex-1 bg-border" />
          </div>
        </>
      )}

      <AppForm
        key="credentials"
        fields={fields}
        components={{ input: AppInput }}
        defaultValues={{ email: defaultEmail ?? "", password: "" }}
        onSubmit={onSubmit}
        formClassName="space-y-4"
        layoutClassName="space-y-4"
        buttonText={use2FA ? "Send verification code" : "Sign in"}
        schema={$SCHEMAS_REPOSITORY.SIGNIN_FORM}
      >
        <div className="mt-5 flex items-center justify-between text-sm">
          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={use2FA}
              onChange={(e) => setUse2FA(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-main-color"
            />
            Two-step verification
          </label>

          <Link
            href="/forgot-password"
            className="font-medium text-main-color hover:underline transition"
          >
            Forgot password?
          </Link>
        </div>

        {unconfirmedEmail && (
          <p className="mt-4 rounded-lg bg-amber-50 dark:bg-amber-500/15 p-3 text-sm text-amber-800 dark:text-amber-300">
            Your email is not confirmed yet.{" "}
            <Link
              href={`/confirm-email?email=${encodeURIComponent(unconfirmedEmail)}`}
              className="font-semibold underline"
            >
              Confirm it now
            </Link>
          </p>
        )}
      </AppForm>
    </>
  );
}
