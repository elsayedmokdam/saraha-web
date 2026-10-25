"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiArrowUp,
  FiEye,
  FiHelpCircle,
  FiPaperclip,
  FiSend,
  FiX,
} from "react-icons/fi";
import { ImSpinner } from "react-icons/im";
import AttachmentGallery from "@/components/shared/attachment-gallery/AttachmentGallery";

import {
  createConversationMessageAction,
  getConversationMessagesAction,
} from "@/services/actions/conversation.action";
import { ConversationMessage } from "@/services/types/message_interface";
import { dayLabel, timeOnly } from "@/services/utils/helpers/formatDate";
import { validateImageFile } from "@/services/utils/helpers/files";
import { notify } from "@/services/utils/helpers/alerts";
import { $SCHEMAS_REPOSITORY } from "@/schemas/schemas.repo";
import { useConversations } from "../ConversationsShell";
import UserAvatar from "@/components/shared/user-avatar/UserAvatar";
import { FaArrowLeft } from "react-icons/fa6";

interface Props {
  conversationId: string;
  initialMessages: ConversationMessage[];
  initialTotalPages: number;
  pageSize: number;
}

const POLL_MS = 10000;
const MAX_FILES = 5;
const MAX_MB = 20;

export default function ChatPanel({
  conversationId,
  initialMessages,
  initialTotalPages,
  pageSize,
}: Props) {
  const { meId, find } = useConversations();
  const conversation = find(conversationId);

  // newest first (as the API returns them); rendered reversed
  const [messages, setMessages] = useState(initialMessages);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const stickToBottom = useRef(true);
  const restoreFromBottom = useRef<number | null>(null);

  const newestId = messages[0]?._id;

  // blob URLs for the image previews (created once per selection, revoked afterwards)
  const previews = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files],
  );
  useEffect(
    () => () => previews.forEach((u) => URL.revokeObjectURL(u)),
    [previews],
  );

  // keep the view where it should be: bottom for new messages, same spot after loading older ones
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (restoreFromBottom.current !== null) {
      el.scrollTop = el.scrollHeight - restoreFromBottom.current;
      restoreFromBottom.current = null;
    } else if (stickToBottom.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages.length, newestId]);

  // Poll the first page and merge what is new (the API has no websockets)
  useEffect(() => {
    const id = setInterval(async () => {
      if (document.hidden) return;
      const res = await getConversationMessagesAction(conversationId, {
        page: "1",
        limit: String(pageSize),
      });
      if (!res.ok) return;
      setMessages((prev) => {
        const known = new Set(prev.map((m) => m._id));
        const fresh = res.data.data.data.filter((m) => !known.has(m._id));
        return fresh.length ? [...fresh, ...prev] : prev;
      });
    }, POLL_MS);
    return () => clearInterval(id);
  }, [conversationId, pageSize]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottom.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  }

  async function loadOlder() {
    const el = scrollRef.current;
    setLoadingOlder(true);
    const res = await getConversationMessagesAction(conversationId, {
      page: String(page + 1),
      limit: String(pageSize),
    });
    setLoadingOlder(false);
    if (!res.ok) return notify.apiError(res.error);

    if (el) restoreFromBottom.current = el.scrollHeight - el.scrollTop;
    setMessages((prev) => {
      const known = new Set(prev.map((m) => m._id));
      return [...prev, ...res.data.data.data.filter((m) => !known.has(m._id))];
    });
    setPage(page + 1);
    setTotalPages(res.data.data.meta.totalPages);
  }

  function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    const accepted: File[] = [];
    for (const file of picked) {
      const problem = validateImageFile(file, MAX_MB);
      if (problem) notify.error(problem);
      else accepted.push(file);
    }
    const next = [...files, ...accepted];
    if (next.length > MAX_FILES)
      notify.error(`Maximum ${MAX_FILES} images allowed`);
    setFiles(next.slice(0, MAX_FILES));
  }

  function autoGrow(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }

  async function handleSend() {
    if (sending) return;

    // the API's model requires text (min 3 chars) even when images are attached
    const parsed = $SCHEMAS_REPOSITORY.CONVERSATION_MESSAGE_FORM.safeParse({
      content: text,
    });
    if (!parsed.success) return notify.error(parsed.error.issues[0].message);

    const form = new FormData();
    form.append("content", parsed.data.content);
    files.forEach((f) => form.append("attachments", f));

    setSending(true);
    const res = await createConversationMessageAction(conversationId, form);
    setSending(false);
    if (!res.ok) return notify.apiError(res.error);

    const created = res.data.data;
    stickToBottom.current = true;
    setMessages((prev) => {
      const known = new Set(prev.map((m) => m._id));
      const add = (Array.isArray(created) ? created : [created])
        .filter((m) => !known.has(m._id))
        .reverse();
      return [...add, ...prev];
    });
    setText("");
    setFiles([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  const ordered = [...messages].reverse();
  const iAsked = conversation ? conversation.sender?._id === meId : undefined;

  const otherUser = conversation
    ? iAsked
      ? conversation.receiver
      : conversation.sender
    : undefined;

  const chatName =
    [otherUser?.firstName, otherUser?.lastName].filter(Boolean).join(" ") ||
    "Conversation";
  const otherUserLabel = otherUser?.username
    ? `@${otherUser.username}`
    : otherUser?.phone || null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* ---------- header ---------- */}
      <header className="flex items-center gap-3 border-b border-border bg-card px-3 py-3 md:px-5">
        <Link href="/conversations" className="hover:text-main-color">
          <FaArrowLeft className="h-5 w-5" />
        </Link>
        <UserAvatar name={chatName} image={otherUser?.image} />

        {/* <ChatAvatar id={otherUser?._id || conversationId} className="size-11" /> */}

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-foreground">{chatName}</p>

          {otherUserLabel && (
            <p className="truncate text-xs text-muted-foreground">
              {otherUserLabel}
            </p>
          )}
        </div>
      </header>

      {/* ---------- messages ---------- */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="chat-wallpaper min-h-0 flex-1 overflow-y-auto px-3 py-4 md:px-10"
      >
        {page < totalPages && (
          <div className="mb-4 flex justify-center">
            <button
              type="button"
              onClick={loadOlder}
              disabled={loadingOlder}
              className="flex cursor-pointer items-center gap-2 rounded-full bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm hover:text-main-color disabled:opacity-60"
            >
              {loadingOlder ? (
                <ImSpinner className="animate-spin" />
              ) : (
                <FiArrowUp />
              )}
              {loadingOlder ? "Loading..." : "Load older messages"}
            </button>
          </div>
        )}

        {ordered.length === 0 && (
          <div className="flex justify-center py-16">
            <p className="rounded-full bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
              No messages yet. Say hello 👋
            </p>
          </div>
        )}

        {ordered.map((m, i) => {
          const mine = m.senderId === meId;
          const prev = ordered[i - 1];
          const newDay =
            !prev || dayLabel(prev.createdAt) !== dayLabel(m.createdAt);
          const grouped = !newDay && prev?.senderId === m.senderId;

          return (
            <div key={m._id}>
              {newDay && (
                <div className="my-3 flex justify-center">
                  <span className="rounded-full bg-card/90 px-3 py-1 text-[11px] font-semibold text-muted-foreground shadow-sm">
                    {dayLabel(m.createdAt)}
                  </span>
                </div>
              )}
              <div
                className={`flex ${mine ? "justify-end" : "justify-start"} ${grouped ? "mt-0.5" : "mt-2"}`}
              >
                <div
                  className={`max-w-[82%] px-3 py-2 shadow-sm md:max-w-[65%] ${
                    mine
                      ? `bg-bubble-out text-bubble-out-foreground rounded-2xl ${grouped ? "" : "bubble-out-tail"}`
                      : `bg-bubble-in text-bubble-in-foreground rounded-2xl ${grouped ? "" : "bubble-in-tail"}`
                  }`}
                >
                  <p className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed">
                    {m.content}
                  </p>
                  <AttachmentGallery attachments={m.attachment} />
                  <p
                    className={`mt-0.5 text-right text-[10px] ${mine ? "text-white/70" : "text-muted-foreground"}`}
                  >
                    {timeOnly(m.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- composer ---------- */}
      <footer className="border-t border-border bg-card px-3 py-3 md:px-4">
        {files.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previews[index]}
                  alt={file.name}
                  className="size-16 rounded-lg border border-border object-cover"
                />
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                  className="absolute -right-1.5 -top-1.5 flex size-5 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white"
                >
                  <FiX size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2">
          <button
            type="button"
            aria-label="Attach images"
            title={`JPEG / PNG, up to ${MAX_FILES} images, ${MAX_MB}MB each`}
            onClick={() => fileInput.current?.click()}
            disabled={files.length >= MAX_FILES}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-main-color disabled:opacity-40"
          >
            <FiPaperclip className="size-5" />
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png"
            multiple
            hidden
            onChange={handlePick}
          />

          <textarea
            ref={textareaRef}
            value={text}
            rows={1}
            onChange={(e) => {
              setText(e.target.value);
              autoGrow(e.target);
            }}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing
              ) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message"
            className="max-h-35 min-h-11 flex-1 resize-none rounded-3xl border border-transparent bg-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-main-color focus:outline-none"
          />

          <button
            type="button"
            aria-label="Send message"
            onClick={handleSend}
            disabled={sending || text.trim().length === 0}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-main-color text-white shadow-md transition hover:bg-main-color/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? (
              <ImSpinner className="animate-spin" />
            ) : (
              <FiSend className="size-5" />
            )}
          </button>
        </div>
        <p className="mt-1.5 hidden px-14 text-[10px] text-muted-foreground md:block">
          Enter to send · Shift + Enter for a new line
        </p>
      </footer>
    </div>
  );
}
