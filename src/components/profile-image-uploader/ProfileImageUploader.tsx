"use client";

import { useRef, useState } from "react";
import { FiCamera } from "react-icons/fi";
import { ImSpinner } from "react-icons/im";
import UserAvatar from "../shared/user-avatar/UserAvatar";
import { uploadProfileImageAction } from "@/services/actions/user.action";
import { validateImageFile } from "@/services/utils/helpers/files";
import { notify } from "@/services/utils/helpers/alerts";
import { useAppDispatch } from "@/redux/store/hooks";
import { setProfile } from "@/redux/store/slices/userSlice/UserSlice";

export default function ProfileImageUploader({
  name,
  image,
}: {
  name: string;
  image?: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const [current, setCurrent] = useState(image);
  const [uploading, setUploading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const problem = validateImageFile(file, 10);
    if (problem) return notify.error(problem);

    const form = new FormData();
    form.append("attachment", file); // the API requires this exact field name

    setUploading(true);
    const res = await uploadProfileImageAction(form);
    setUploading(false);

    if (!res.ok) return notify.apiError(res.error);

    notify.success("Profile image updated");
    setCurrent(res.data.data.image);
    dispatch(setProfile(res.data.data));
  }

  return (
    <div className="relative w-fit">
      <UserAvatar name={name} image={current} className="size-28 text-3xl" />
      <button
        type="button"
        aria-label="Change profile image"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="absolute bottom-0 right-0 flex size-9 items-center justify-center rounded-full bg-main-color text-white shadow-md hover:bg-main-color/90 cursor-pointer"
      >
        {uploading ? <ImSpinner className="animate-spin" /> : <FiCamera />}
      </button>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png" hidden onChange={handleChange} />
    </div>
  );
}
