"use client";

import { useRouter } from "next/navigation";
import { FaShieldAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import AppForm from "../shared/app-form/AppForm";
import AppInput from "../shared/app-input/AppInput";
import { FormField } from "../shared/app-form/app_form.interface";
import { $SCHEMAS_REPOSITORY } from "@/schemas/schemas.repo";
import {
  confirmEmailAction,
  resendConfirmEmailOtpAction,
} from "@/services/actions/auth.action";
import { notify } from "@/services/utils/helpers/alerts";
import { useCooldown } from "@/hooks/useCooldown";
import { useRef } from "react";
import { AppFormRef } from "../shared/app-form/AppForm";

const fields: FormField[] = [
  {
    name: "email",
    type: "input",
    label: "Email*",
    placeholder: "you@example.com",
    props: { type: "email", autoComplete: "email", className: "rounded-xl", icon: <MdEmail className="size-4 text-muted-foreground/70" />, position: "start" },
  },
  {
    name: "otp",
    type: "input",
    label: "Confirmation code*",
    placeholder: "••••••",
    props: { type: "text", inputMode: "numeric", maxLength: 6, autoComplete: "one-time-code", className: "rounded-xl tracking-widest text-center text-lg font-mono", icon: <FaShieldAlt className="size-4 text-muted-foreground/70" />, position: "start" },
  },
];

export default function ConfirmEmailForm({ defaultEmail = "" }: { defaultEmail?: string }) {
  const router = useRouter();
  const formRef = useRef<AppFormRef>(null);
  // The API's OTP lives 120s and it refuses to send another one before it expires
  const cooldown = useCooldown(120);

  async function onSubmit(data: { email: string; otp: string }) {
    const res = await confirmEmailAction(data);

    if (!res.ok) {
      notify.apiError(res.error);
      return;
    }
    notify.success(res.data.message);
    router.push(`/signin?email=${encodeURIComponent(data.email)}`);
  }

  async function handleResend() {
    const email = formRef.current?.getValues().email;
    if (!email) return notify.error("Enter your email first");

    const res = await resendConfirmEmailOtpAction({ email });
    if (!res.ok) return notify.apiError(res.error);

    notify.success(res.data.message);
    cooldown.start();
  }

  return (
    <AppForm
      ref={formRef}
      fields={fields}
      components={{ input: AppInput }}
      defaultValues={{ email: defaultEmail, otp: "" }}
      onSubmit={onSubmit}
      buttonText="Confirm email"
      schema={$SCHEMAS_REPOSITORY.CONFIRM_EMAIL_FORM}
    >
      <div className="text-center text-xs text-muted-foreground mt-2">
        Didn&apos;t receive the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown.active}
          className="font-semibold text-main-color hover:underline disabled:text-muted-foreground/70 disabled:no-underline cursor-pointer"
        >
          {cooldown.active ? `Resend in ${cooldown.remaining}s` : "Resend code"}
        </button>
      </div>
    </AppForm>
  );
}
