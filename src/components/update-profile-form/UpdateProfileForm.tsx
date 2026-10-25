"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaCalendar, FaPhone, FaUser } from "react-icons/fa6";
import { FiInfo } from "react-icons/fi";
import { MdEmail } from "react-icons/md";
import { FormField } from "../shared/app-form/app_form.interface";
import AppInput from "../shared/app-input/AppInput";
import AppSelectOptions from "../shared/app-select-options/AppSelectOptions";
import AppForm, { AppFormRef } from "../shared/app-form/AppForm";
import { updateUserDataAction } from "@/services/actions/user.action";
import { notify } from "@/services/utils/helpers/alerts";
import { $SCHEMAS_REPOSITORY } from "@/schemas/schemas.repo";
import { User } from "@/services/types/user_interface";
import { useAppDispatch } from "@/redux/store/hooks";
import { setProfile } from "@/redux/store/slices/userSlice/UserSlice";

interface FormValues {
  username: string;
  email: string;
  phone: string;
  DOB?: string;
  gender?: string;
}

const iconClass = "size-4 text-muted-foreground";

const fields: FormField[] = [
  {
    name: "username",
    type: "input",
    label: "Full name",
    placeholder: "First Last",
    props: { type: "text", autoComplete: "name", className: "rounded-xl", icon: <FaUser className={iconClass} />, position: "start" },
  },
  {
    name: "email",
    type: "input",
    label: "Email address",
    placeholder: "you@example.com",
    props: { type: "email", autoComplete: "email", className: "rounded-xl", icon: <MdEmail className={iconClass} />, position: "start" },
  },
  {
    name: "phone",
    type: "input",
    label: "Phone number",
    placeholder: "01012345678",
    props: { type: "tel", autoComplete: "tel", className: "rounded-xl", icon: <FaPhone className={iconClass} />, position: "start" },
  },
  {
    name: "DOB",
    type: "input",
    label: "Date of birth (optional)",
    props: { type: "date", className: "rounded-xl", icon: <FaCalendar className={iconClass} />, position: "start" },
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

export default function UpdateProfileForm({ user }: { user: User }) {
  const formRef = useRef<AppFormRef>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { update } = useSession();

  // PUT /user/update-data
  async function handleSave(data: FormValues) {
    // strict schema on the API: only send what is filled, `gender` as a JSON number
    const res = await updateUserDataAction({
      username: data.username,
      email: data.email,
      phone: data.phone,
      ...(data.DOB ? { DOB: data.DOB } : {}),
      ...(data.gender === "0" || data.gender === "1"
        ? { gender: Number(data.gender) as 0 | 1 }
        : {}),
    });

    if (!res.ok) return notify.apiError(res.error);

    notify.success(res.data.message || "Profile updated successfully!");
    dispatch(setProfile(res.data.data));
    await update({ action: "profile" }); // refresh the name / email kept in the session
    router.refresh();
  }

  return (
    <AppForm
      ref={formRef}
      fields={fields}
      components={{ input: AppInput, select: AppSelectOptions }}
      defaultValues={{
        username: user.username,
        email: user.email,
        // the API never returns the phone number (it is stored encrypted), so it has to be typed again
        phone: "",
        DOB: user.DOB ? user.DOB.slice(0, 10) : "",
        gender: user.gender === 0 || user.gender === 1 ? String(user.gender) : "",
      }}
      onSubmit={handleSave}
      buttonText="Save changes"
      formClassName="space-y-5"
      layoutClassName="grid gap-4 sm:grid-cols-2 sm:[&>*:nth-child(-n+3)]:col-span-2"
      schema={$SCHEMAS_REPOSITORY.UPDATE_PROFILE_FORM}
    >
      {/* <p className="flex gap-2 rounded-xl bg-accent/60 p-3 text-xs text-accent-foreground">
        <FiInfo className="mt-0.5 shrink-0" />
        For your privacy the API never sends your phone number back, so please enter it again when
        you save.
      </p> */}
    </AppForm>
  );
}
