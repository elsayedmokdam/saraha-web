"use client";

import { useState } from "react";
import { FiCheck, FiTrash2, FiUserCheck, FiX } from "react-icons/fi";
import { FaUserSecret } from "react-icons/fa6";
import AppButton from "../app-button/AppButton";
import AttachmentGallery from "../attachment-gallery/AttachmentGallery";
import { Message } from "@/services/types/message_interface";
import { dayLabel, timeOnly } from "@/services/utils/helpers/formatDate";
import { confirmDialog, notify } from "@/services/utils/helpers/alerts";
import { deleteMessageAction } from "@/services/actions/message.action";
import { createIdentityRequestAction } from "@/services/actions/identity_request.action";
import Link from "next/link";

interface MessageCardProps {
  message: Message;
  /** id of the logged-in user */
  meId?: string;
  onDeleted: (id: string) => void;
}

/** One message of the inbox, drawn as a chat bubble (received on the left, sent on the right). */
export default function MessageCard({
  message,
  meId,
  onDeleted,
}: MessageCardProps) {
  const [busy, setBusy] = useState<"delete" | "request" | null>(null);
  const [requested, setRequested] = useState(false);

  const sentByMe = !!meId && message.senderId === meId;

  async function handleDelete() {
    const ok = await confirmDialog({
      text: "This message will be deleted permanently.",
      confirmText: "Delete",
    });
    if (!ok) return;

    setBusy("delete");
    const res = await deleteMessageAction(message._id);
    setBusy(null);

    if (!res.ok) return notify.apiError(res.error);
    notify.success(res.data.message);
    onDeleted(message._id);
  }

  async function handleAskIdentity() {
    setBusy("request");
    const res = await createIdentityRequestAction(message._id);
    setBusy(null);

    if (!res.ok) {
      // 409: a request already exists for this message
      if (res.error.status === 409) setRequested(true);
      return notify.apiError(res.error);
    }
    setRequested(true);
    notify.success(res.data.message);
  }

  const meta = (
    <p
      className={`mt-1 text-right text-[10px] ${sentByMe ? "text-white/70" : "text-muted-foreground"}`}
    >
      {dayLabel(message.createdAt)} · {timeOnly(message.createdAt)}
    </p>
  );

  /* ------------------------------ sent ------------------------------ */
  if (sentByMe) {
    return (
      <article className="flex justify-end">
        <div className="max-w-[85%] md:max-w-[70%]">
          <div className="bubble-out-tail rounded-2xl bg-bubble-out px-4 py-2.5 text-bubble-out-foreground shadow-sm">
            <p className="mb-1 text-[11px] font-semibold text-white/80">
              To {message.isAnonymous ? "Anonymous" : "Identity revealed"}
            </p>
            {message.content && (
              <p className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed">
                {message.content}
              </p>
            )}
            <AttachmentGallery attachments={message.attachment} />
            {meta}
          </div>
        </div>
      </article>
    );
  }

  /* ---------------------------- received ---------------------------- */
  return (
    <article className="flex items-end gap-2">
      <span className="mb-6 flex size-9 shrink-0 items-center justify-center rounded-full bg-card text-main-color shadow-sm">
        <FaUserSecret />
      </span>

      <div className="max-w-[85%] md:max-w-[70%]">
        <div className="bubble-in-tail rounded-2xl bg-bubble-in px-4 py-2.5 text-bubble-in-foreground shadow-sm">
          <p className="mb-1 text-[11px] font-semibold text-main-color">
            {message.isAnonymous ? (
              "Anonymous"
            ) : (
              <>
                Identity revealed ·{" "}
                <Link
                  href={`/conversations`}
                  className="underline underline-offset-2 hover:opacity-80"
                >
                  See chats
                </Link>
              </>
            )}
          </p>
          {message.content && (
            <p className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed">
              {message.content}
            </p>
          )}
          <AttachmentGallery attachments={message.attachment} />
          {meta}
        </div>
        {/* The API lets only the RECEIVER delete / ask who sent it */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
          {/* Identity Request Status / Action */}
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {message.requestStatus === "pending" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <span className="size-1.5 animate-pulse rounded-full bg-current" />
                Pending
              </span>
            ) : message.requestStatus === "rejected" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
                <FiX className="size-3.5" />
                Rejected
              </span>
            ) : message.requestStatus === "notasked" ? (
              <AppButton
                onClick={handleAskIdentity}
                loading={busy === "request"}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-main-color/20 bg-main-color/5 px-3.5 py-2 text-xs font-semibold text-main-color transition-all hover:border-main-color/40 hover:bg-main-color/10 active:scale-[0.98]"
              >
                <FiUserCheck className="size-3.5" />
                Ask who sent
              </AppButton>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <FiCheck className="size-3.5" />
                Accepted
              </span>
            )}
          </div>

          {/* Delete Action */}
          <AppButton
            onClick={handleDelete}
            loading={busy === "delete"}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-500/15 bg-card px-3.5 py-2 text-xs font-semibold text-red-500 transition-all hover:border-red-500/30 hover:bg-red-500/5 active:scale-[0.98] dark:hover:bg-red-500/10"
          >
            <FiTrash2 className="size-3.5" />
            Delete
          </AppButton>
        </div>
      </div>
    </article>
  );
}
