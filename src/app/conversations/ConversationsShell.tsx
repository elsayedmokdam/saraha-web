"use client";

import { createContext, useContext, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FiChevronDown,
  FiEye,
  FiHelpCircle,
  FiMessageCircle,
  FiSearch,
} from "react-icons/fi";
import { getUserConversationsAction } from "@/services/actions/conversation.action";
import { Conversation } from "@/services/types/message_interface";
import { listTime } from "@/services/utils/helpers/formatDate";
import UserAvatar from "@/components/shared/user-avatar/UserAvatar";

/** Lets the chat on the right know which side of the conversation I am. */
interface ConversationsContextValue {
  meId: string;
  find: (id: string) => Conversation | undefined;
}
const ConversationsContext = createContext<ConversationsContextValue>({
  meId: "",
  find: () => undefined,
});
export const useConversations = () => useContext(ConversationsContext);

interface Props {
  meId: string;
  initialConversations: Conversation[];
  initialTotal: number;
  initialTotalPages: number;
  initialError?: string;
  limit: number;
  children: React.ReactNode;
}

export default function ConversationsShell({
  meId,
  initialConversations,
  initialTotal,
  initialTotalPages,
  initialError,
  limit,
  children,
}: Props) {
  const params = useParams<{ id?: string }>();
  const activeId = params?.id;

  const [items, setItems] = useState(initialConversations);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialTotal);
  const [hasMore, setHasMore] = useState(initialTotalPages > 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const [query, setQuery] = useState("");

  // The API does not sort: newest conversation first
  const sorted = useMemo(
    () =>
      [...items].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [items],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return sorted;

    return sorted.filter((c) => {
      const senderUser = Array.isArray(c.sender) ? c.sender[0] : c.sender;

      const iAsked = senderUser?._id === meId;
      const otherUser = iAsked ? c.receiver : senderUser;

      const fullName = [otherUser?.firstName, otherUser?.lastName]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return fullName.includes(q);
    });
  }, [sorted, query, meId]);

  const ctx = useMemo(
    () => ({ meId, find: (id: string) => items.find((c) => c._id === id) }),
    [meId, items],
  );

  async function loadMore() {
    setLoading(true);
    setError(undefined);
    const res = await getUserConversationsAction({
      page: String(page + 1),
      limit: String(limit),
    });
    setLoading(false);
    if (!res.ok) return setError(res.error.message);

    const { data, meta } = res.data.data;
    const known = new Set(items.map((c) => c._id));
    const fresh = data.filter((c) => !known.has(c._id));
    setTotal(meta.total);
    setPage(page + 1);
    setItems((prev) => [...prev, ...fresh]);
    // if the API ignored `page` it answers the same items again: stop instead of looping
    setHasMore(fresh.length > 0 && meta.page < meta.totalPages);
  }

  return (
    <ConversationsContext.Provider value={ctx}>
      <div className="flex h-full min-h-0">
        {/* ------------------ chat list ------------------ */}
        <aside
          className={`${activeId ? "hidden md:flex" : "flex"} w-full shrink-0 flex-col border-r border-border bg-card md:w-85 lg:w-95`}
        >
          <div className="space-y-3 border-b border-border p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-foreground">Chats</h1>
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                {visible.length}
              </span>
            </div>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name..."
                className="w-full rounded-xl border border-transparent bg-muted py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-main-color focus:outline-none"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {error && items.length === 0 && (
              <p className="p-6 text-center text-sm text-red-500">{error}</p>
            )}

            {!error && items.length === 0 && (
              <div className="flex flex-col items-center gap-3 p-8 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-muted text-2xl text-muted-foreground">
                  <FiMessageCircle />
                </span>
                <p className="font-semibold text-foreground">No chats yet</p>
                <p className="text-sm text-muted-foreground">
                  A chat starts when someone accepts your identity request, or
                  when you accept one.
                </p>
                <Link
                  href="/identity-requests"
                  className="mt-1 rounded-xl bg-main-color px-4 py-2 text-sm font-semibold text-white hover:bg-main-color/90"
                >
                  Identity requests
                </Link>
              </div>
            )}

            <ul>
              {visible.map((c) => {
                const iAsked = c.sender?._id === meId;
                const otherUser = iAsked ? c.receiver : c.sender;

                const fullName = [otherUser?.firstName, otherUser?.lastName]
                  .filter(Boolean)
                  .join(" ");

                const chatName =
                  fullName || otherUser?.firstName || "Unknown user";
                const active = c._id === activeId;

                return (
                  <li key={c._id}>
                    <Link
                      href={`/conversations/${c._id}`}
                      className={`flex items-center gap-3 border-l-4 px-4 py-3 transition ${
                        active
                          ? "border-main-color bg-accent/70"
                          : "border-transparent hover:bg-muted/70"
                      }`}
                    >
                      <UserAvatar name={chatName} image={otherUser?.image} />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate font-semibold text-foreground">
                            {chatName}
                          </p>

                          <span className="shrink-0 text-[11px] text-muted-foreground">
                            {listTime(c.createdAt)}
                          </span>
                        </div>

                        <p className="truncate text-xs text-muted-foreground">
                          @{otherUser?.email || "unknown"}
                        </p>

                        <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                          {iAsked ? (
                            <FiHelpCircle className="shrink-0" />
                          ) : (
                            <FiEye className="shrink-0" />
                          )}

                          {iAsked
                            ? "You asked who they were"
                            : "You revealed your identity"}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {visible.length === 0 && items.length > 0 && (
              <p className="p-6 text-center text-sm text-muted-foreground">
                No chat matches “{query}”.
              </p>
            )}

            {hasMore && (
              <button
                type="button"
                onClick={loadMore}
                disabled={loading}
                className="mx-auto my-4 flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:border-main-color hover:text-main-color disabled:opacity-60"
              >
                <FiChevronDown /> {loading ? "Loading..." : "Load more"}
              </button>
            )}
            {/* {!hasMore && total > items.length && (
              <p className="px-4 py-3 text-center text-xs text-muted-foreground">
                Showing {items.length} of {total} chats.
              </p>
            )} */}
          </div>
        </aside>

        {/* ------------------ open chat ------------------ */}
        <section
          className={`${activeId ? "flex" : "hidden md:flex"} min-w-0 flex-1 flex-col`}
        >
          {children}
        </section>
      </div>
    </ConversationsContext.Provider>
  );
}
