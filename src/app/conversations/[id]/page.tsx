import $SERVICE_REPOSITORY from "@/services/service.repo";
import { FiAlertCircle } from "react-icons/fi";
import Link from "next/link";
import ChatPanel from "./ChatPanel";

export const metadata = { title: "Chat" };
const PAGE_SIZE = 20;

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const response = /^[a-f\d]{24}$/i.test(id)
    ? await $SERVICE_REPOSITORY.Conversations.getMessages(id, { page: "1", limit: String(PAGE_SIZE) })
    : null;

  if (!response || !response.ok) {
    return (
      <div className="chat-wallpaper flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-card text-3xl text-red-500 shadow-md">
          <FiAlertCircle />
        </span>
        <h2 className="text-lg font-bold text-foreground">Conversation unavailable</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          {response && !response.ok ? response.error.message : "Invalid conversation id."}
        </p>
        <Link href="/conversations" className="rounded-xl bg-main-color px-5 py-2.5 text-sm font-semibold text-white hover:bg-main-color/90">
          Back to chats
        </Link>
      </div>
    );
  }

  const { data, meta } = response.data.data;

  return (
    <ChatPanel
      // a new chat must start with fresh state
      key={id}
      conversationId={id}
      initialMessages={data}
      initialTotalPages={meta.totalPages}
      pageSize={PAGE_SIZE}
    />
  );
}
