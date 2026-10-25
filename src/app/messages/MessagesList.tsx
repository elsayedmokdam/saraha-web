"use client";

import { useRef, useState } from "react";
import { FiInbox, FiSearch, FiList, FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import MessageCard from "@/components/shared/message-card/MessageCard";
import SegmentedTabs from "@/components/shared/segmented-tabs/SegmentedTabs";
import PaginationStatus from "@/components/shared/pagination-status/PaginationStatus";
import IsEmpty from "@/components/shared/is-empty/IsEmpty";
import { getMessagesAction } from "@/services/actions/message.action";
import { Message } from "@/services/types/message_interface";
import { MessageType } from "@/services/types/enums";
import { useAppSelector } from "@/redux/store/hooks";

interface Props {
  initialMessages: Message[];
  initialTotalPages: number;
  initialError?: string;
  limit: number;
}

export default function MessagesList({
  initialMessages,
  initialTotalPages,
  initialError,
  limit,
}: Props) {
  const meId = useAppSelector((s) => s.user.profile?._id);

  const [type, setType] = useState<MessageType>("2");
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(initialError);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function load(nextType: MessageType, nextSearch: string, nextPage: number) {
    setIsLoading(true);
    setError(undefined);

    const res = await getMessagesAction({
      type: nextType,
      page: String(nextPage),
      limit: String(limit),
      search: nextSearch.trim() || undefined,
    });
    setIsLoading(false);

    if (!res.ok) return setError(res.error.message);

    const { data, meta } = res.data.data;
    setMessages((prev) => (nextPage === 1 ? data : [...prev, ...data]));
    setPage(nextPage);
    setTotalPages(meta.totalPages);
  }

  function handleTab(next: MessageType) {
    setType(next);
    load(next, search, 1);
  }

  function handleSearch(value: string) {
    setSearch(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => load(type, value, 1), 400); // debounce
  }

  return (
    <>
      {/* toolbar */}
      <div className="flex flex-col gap-3 border-b border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <SegmentedTabs
          value={type}
          onChange={handleTab}
          options={[
            { value: "2", label: "All", icon: <FiList /> },
            { value: "1", label: "Received", icon: <FiArrowDownLeft /> },
            { value: "0", label: "Sent", icon: <FiArrowUpRight /> },
          ]}
        />

        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search messages..."
            className="w-full rounded-xl border border-transparent bg-muted py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-main-color focus:outline-none sm:w-64"
          />
        </div>
      </div>

      {/* feed */}
      <div className="chat-wallpaper min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-10">
        <div className="mx-auto max-w-3xl">
          {messages.length === 0 && !isLoading && !error ? (
            <IsEmpty
              icon={<FiInbox />}
              title="No messages yet"
              description={
                search
                  ? "No message matches your search."
                  : "Share your link so people can send you honest messages."
              }
              links={[
                { label: "Share my link", href: "/profile" },
                { label: "Send a message", href: "/messages/new" },
              ]}
            />
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageCard
                  key={message._id}
                  message={message}
                  meId={meId}
                  onDeleted={(id) => setMessages((prev) => prev.filter((m) => m._id !== id))}
                />
              ))}

              <PaginationStatus
                hasMorePages={page < totalPages}
                currentPageNum={page}
                totalPages={totalPages}
                isLoading={isLoading}
                hasError={!!error}
                errorMessage={error}
                handleLoadMore={() => load(type, search, page + 1)}
                itemsCount={messages.length}
                noun="messages"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
