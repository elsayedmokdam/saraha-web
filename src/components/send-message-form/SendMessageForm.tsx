"use client";

import { useState } from "react";
import { FaIdBadge } from "react-icons/fa6";
import Link from "next/link";
import AppForm, { AppFormRef } from "../shared/app-form/AppForm";
import AppInput from "../shared/app-input/AppInput";
import AppTextarea from "../shared/app-textarea/AppTextarea";
import AttachmentPicker from "../shared/attachment-picker/AttachmentPicker";
import { FormField } from "../shared/app-form/app_form.interface";
import { $SCHEMAS_REPOSITORY } from "@/schemas/schemas.repo";
import { createMessageAction } from "@/services/actions/message.action";
import { notify } from "@/services/utils/helpers/alerts";
import { useRef } from "react";

export default function SendMessageForm({ receiverId }: { receiverId?: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [sent, setSent] = useState(false);
  const formRef = useRef<AppFormRef>(null);

  const fields: FormField[] = [
    {
      name: "receiverId",
      type: "input",
      label: "Receiver id*",
      placeholder: "Paste the id of the person (24 characters)",
      hidden: !!receiverId,
      props: { className: "rounded-xl font-mono", icon: <FaIdBadge className="size-4 text-muted-foreground/70" />, position: "start" },
    },
    {
      name: "content",
      type: "textarea",
      label: "Your message",
      placeholder: "Write something honest (min. 3 characters)...",
      props: { rows: 6 },
    },
  ];

  async function onSubmit(data: { receiverId: string; content: string }) {
    const content = data.content?.trim() ?? "";

    // The API needs text and/or at least one image
    if (!content && files.length === 0) {
      return notify.error("Write a message or attach at least one image");
    }

    const form = new FormData();
    form.append("receiverId", data.receiverId);
    if (content) form.append("content", content);
    files.forEach((file) => form.append("attachments", file));

    const res = await createMessageAction(form);
    if (!res.ok) return notify.apiError(res.error);

    notify.success(res.data.message);
    formRef.current?.reset({ receiverId: receiverId ?? "", content: "" });
    setFiles([]);
    setSent(true);
  }

  return (
    <div className="space-y-5">
      <AppForm
        ref={formRef}
        fields={fields}
        components={{ input: AppInput, textarea: AppTextarea }}
        defaultValues={{ receiverId: receiverId ?? "", content: "" }}
        schema={$SCHEMAS_REPOSITORY.SEND_MESSAGE_FORM}
        onSubmit={onSubmit}
        buttonText="Send message"
        layoutClassName="space-y-5"
      >
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Attachments (optional)</p>
          <AttachmentPicker files={files} onChange={setFiles} maxFiles={3} maxSizeMB={10} />
        </div>
      </AppForm>

      {sent && (
        <p className="text-center text-sm text-muted-foreground">
          Sent!{" "}
          <Link href="/messages" className="font-semibold text-main-color hover:underline">
            See your messages
          </Link>
        </p>
      )}
    </div>
  );
}
