"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiCheck,
  FiX,
  FiMessageCircle,
  FiUserCheck,
  FiClock,
  FiShield,
  FiArrowUpRight,
} from "react-icons/fi";

import AppButton from "../app-button/AppButton";
import AttachmentGallery from "../attachment-gallery/AttachmentGallery";
import StatusBadge from "../status-badge/StatusBadge";

import { IdentityRequest } from "@/services/types/message_interface";
import { formatDateTime } from "@/services/utils/helpers/formatDate";

interface Props {
  request: IdentityRequest;
  conversationId?: string;
  onRespond: (
    request: IdentityRequest,
    status: "accepted" | "rejected"
  ) => Promise<void>;
}

export default function IdentityRequestCard({
  request,
  conversationId,
  onRespond,
}: Props) {
  const [busy, setBusy] = useState<"accepted" | "rejected" | null>(null);

  const message = request.message?.[0];
  const isPending = request.status === "pending";

  async function respond(status: "accepted" | "rejected") {
    if (busy !== null) return;

    setBusy(status);

    try {
      await onRespond(request, status);
    } finally {
      setBusy(null);
    }
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:border-main-color/30 hover:shadow-md">
      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-border/70 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-main-color/10 text-main-color">
            <FiUserCheck className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-foreground">
                Identity request
              </h3>

              <StatusBadge
                status={request.status}
                label={request.status}
              />
            </div>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Someone who received your message wants to know who you are.
            </p>

            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground/80">
              <FiClock className="size-3.5 shrink-0" />
              <span>{formatDateTime(request.createdAt)}</span>
            </p>
          </div>
        </div>
      </header>

      {/* Message */}
      <div className="p-4 sm:p-5">
        <div className="overflow-hidden rounded-xl border border-border/70 bg-muted/30">
          <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
            <FiMessageCircle className="size-4 text-main-color" />

            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Original message
            </p>
          </div>

          <div className="p-4">
            <p className="whitespace-pre-wrap wrap-break-word text-sm leading-7 text-foreground">
              {message?.content ||
                (message?.attachment?.length
                  ? "This message contains attachments only."
                  : "This message is no longer available.")}
            </p>

            {!!message?.attachment?.length && (
              <div className="mt-3 border-t border-border/60 pt-3">
                <AttachmentGallery attachments={message.attachment} />
              </div>
            )}
          </div>
        </div>

        {/* Pending Actions */}
        {isPending && (
          <div className="mt-5">
            <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
              <FiShield className="size-4 shrink-0" />
              <span>
                You decide whether to reveal your identity or stay anonymous.
              </span>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <AppButton
                onClick={() => respond("accepted")}
                loading={busy !== null}
                disabled={busy !== null}
                className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-main-color px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-main-color/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiCheck className="size-4 shrink-0" />
                <span>
                  {busy === "accepted"
                    ? "Revealing identity..."
                    : "Reveal identity & chat"}
                </span>
              </AppButton>

              <AppButton
                onClick={() => respond("rejected")}
                loading={busy !== null}
                disabled={busy !== null}
                className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:text-red-400"
              >
                <FiX className="size-4 shrink-0" />
                <span>
                  {busy === "rejected"
                    ? "Keeping anonymous..."
                    : "Stay anonymous"}
                </span>
              </AppButton>
            </div>
          </div>
        )}

        {/* Conversation Link */}
        {conversationId && (
          <div className={isPending ? "mt-4 border-t border-border/60 pt-4" : ""}>
            <Link
              href={`/conversations/${conversationId}`}
              className="group/link flex min-h-11 items-center justify-between gap-3 rounded-xl border border-main-color/20 bg-main-color/5 px-4 py-3 text-sm font-medium text-main-color transition-colors hover:border-main-color/40 hover:bg-main-color/10"
            >
              <span className="flex items-center gap-2">
                <FiMessageCircle className="size-4 shrink-0" />
                Open conversation
              </span>

              <FiArrowUpRight className="size-4 shrink-0 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}