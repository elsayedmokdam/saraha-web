"use client";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa6";
import { FormField } from "../shared/app-form/app_form.interface";
import AppInput from "../shared/app-input/AppInput";
import AppForm, { AppFormRef } from "../shared/app-form/AppForm";
import { updatePasswordAction } from "@/services/actions/user.action";
import { logoutAction } from "@/services/actions/auth.action";
import { notify } from "@/services/utils/helpers/alerts";
import { $SCHEMAS_REPOSITORY } from "@/schemas/schemas.repo";
import { useAppDispatch } from "@/redux/store/hooks";
import { clearProfile } from "@/redux/store/slices/userSlice/UserSlice";
import { setPendingCount } from "@/redux/store/slices/requestsSlice/RequestsSlice";

interface FormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePasswordForm() {
  const formRef = useRef<AppFormRef>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [show, setShow] = useState(false);
  const [logoutEverywhere, setLogoutEverywhere] = useState(false);

  const fields: FormField[] = useMemo(() => {
    const field = (name: string, label: string, placeholder: string, autoComplete: string, withEye = false): FormField => ({
      name,
      type: "input",
      label,
      placeholder,
      props: {
        type: show ? "text" : "password",
        autoComplete,
        className: "rounded-xl",
        icon: <FaLock className="size-4 text-muted-foreground" />,
        position: "start",
        ...(withEye && {
          endIcon: (
            <button
              type="button"
              onClick={() => setShow((prev) => !prev)}
              aria-label={show ? "Hide passwords" : "Show passwords"}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted cursor-pointer"
            >
              {show ? <FaEyeSlash className="size-4" /> : <FaEye className="size-4" />}
            </button>
          ),
          endIconClassName: "pr-0",
        }),
      },
    });
    return [
      field("currentPassword", "Current password", "Enter your current password", "current-password", true),
      field("newPassword", "New password", "Enter a new password", "new-password"),
      field("confirmPassword", "Confirm new password", "Repeat the new password", "new-password"),
    ];
  }, [show]);

  // PATCH /user/update-password
  async function handleSubmit(data: FormValues) {
    const res = await updatePasswordAction(data);

    if (!res.ok) return notify.apiError(res.error);

    notify.success(res.data.message || "Password updated successfully!");
    formRef.current?.reset();

    // The API does not end the other sessions when the password changes: offer to do it here
    if (logoutEverywhere) {
      const logoutRes = await logoutAction(1);
      if (!logoutRes.ok) {
        notify.apiError(logoutRes.error);
        return;
      }
      await signOut({ redirect: false });
      dispatch(clearProfile());
      dispatch(setPendingCount(0));
      router.push("/signin");
      router.refresh();
    }
  }

  return (
    <AppForm
      ref={formRef}
      fields={fields}
      components={{ input: AppInput }}
      defaultValues={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
      onSubmit={handleSubmit}
      buttonText="Update password"
      formClassName="space-y-5"
      layoutClassName="space-y-4"
      schema={$SCHEMAS_REPOSITORY.UPDATE_PASSWORD_FORM}
    >
      <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
        <input
          type="checkbox"
          checked={logoutEverywhere}
          onChange={(e) => setLogoutEverywhere(e.target.checked)}
          className="mt-0.5 size-4 rounded accent-main-color"
        />
        <span>
          Log me out of all devices after changing it
          <span className="block text-xs text-muted-foreground">
            Recommended if you think someone else knows your old password.
          </span>
        </span>
      </label>
    </AppForm>
  );
}
