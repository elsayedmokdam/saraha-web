"use client";
import { useMemo, useState } from "react";
import AppForm from "../shared/app-form/AppForm";
import { FaCalendar, FaEye, FaEyeSlash, FaLock, FaPhone, FaUser } from "react-icons/fa6";
import { FormField } from "../shared/app-form/app_form.interface";
import AppInput from "../shared/app-input/AppInput";
import AppSelectOptions from "../shared/app-select-options/AppSelectOptions";
import { MdEmail } from "react-icons/md";
import { $SCHEMAS_REPOSITORY } from "@/schemas/schemas.repo";
import { signupAction } from "@/services/actions/auth.action";
import { SignupPayload } from "@/services/types/auth_interface";
import { useRouter } from "next/navigation";
import { notify } from "@/services/utils/helpers/alerts";

interface SignupFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  DOB?: string;
  gender?: string;
}

export default function SignupForm() {
  const route = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const fields: FormField[] = useMemo(() => {
    const eye = (
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted cursor-pointer"
      >
        {showPassword ? <FaEyeSlash className="size-4" /> : <FaEye className="size-4" />}
      </button>
    );
    return [
      {
        name: "username",
        type: "input",
        label: "Full name*",
        placeholder: "First Last",
        props: { type: "text", autoComplete: "name", className: "rounded-xl", icon: <FaUser className="size-4 text-muted-foreground/70" />, position: "start" },
      },
      {
        name: "email",
        type: "input",
        label: "Email*",
        placeholder: "you@example.com",
        props: { type: "email", autoComplete: "email", className: "rounded-xl", icon: <MdEmail className="size-4 text-muted-foreground/70" />, position: "start" },
      },
      {
        name: "password",
        type: "input",
        label: "Password*",
        placeholder: "create a strong password",
        props: { type: showPassword ? "text" : "password", autoComplete: "new-password", className: "rounded-xl", icon: <FaLock className="size-4 text-muted-foreground/70" />, position: "start", endIcon: eye, endIconClassName: "pr-0" },
      },
      {
        name: "confirmPassword",
        type: "input",
        label: "Confirm password*",
        placeholder: "confirm your password",
        props: { type: showPassword ? "text" : "password", autoComplete: "new-password", className: "rounded-xl", icon: <FaLock className="size-4 text-muted-foreground/70" />, position: "start" },
      },
      {
        name: "phone",
        type: "input",
        label: "Phone number*",
        placeholder: "01012345678",
        props: { type: "tel", autoComplete: "tel", className: "rounded-xl", icon: <FaPhone className="size-4 text-muted-foreground/70" />, position: "start" },
      },
      {
        name: "DOB",
        type: "input",
        label: "Date of birth (optional)",
        props: { type: "date", className: "rounded-xl", icon: <FaCalendar className="size-4 text-muted-foreground/70" />, position: "start" },
      },
      {
        name: "gender",
        type: "select",
        label: "Gender (optional)",
        placeholder: "Select gender",
        props: {
          values: [
            { value: "0", label: "Male" },
            { value: "1", label: "Female" },
          ],
        },
      },
    ];
  }, [showPassword]);

  async function onSubmit(data: SignupFormValues) {
    // The API validates its body with a strict schema: send only the fields that are filled,
    // and `gender` as a JSON number.
    const payload: SignupPayload = {
      username: data.username,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      phone: data.phone,
      ...(data.DOB ? { DOB: data.DOB } : {}),
      ...(data.gender === "0" || data.gender === "1"
        ? { gender: Number(data.gender) as 0 | 1 }
        : {}),
    };

    const res = await signupAction(payload);

    if (!res.ok) {
      notify.apiError(res.error);
      return;
    }

    notify.success(res.data.message);
    route.push(`/confirm-email?email=${encodeURIComponent(data.email)}`);
  }

  return (
    <AppForm
      fields={fields}
      components={{ input: AppInput, select: AppSelectOptions }}
      onSubmit={onSubmit}
      formClassName="space-y-4"
      layoutClassName="space-y-4"
      buttonText="Create account"
      schema={$SCHEMAS_REPOSITORY.SIGNUP_FORM}
    />
  );
}
