import $SERVICE_REPOSITORY from "@/services/service.repo";
import { getMyToken } from "@/services/utils/helpers/getMyToken";
import ConversationsShell from "./ConversationsShell";

const LIMIT = 20;

/**
 * Two-pane chat layout (like WhatsApp Web): the list stays mounted on the left while
 * `/conversations/[id]` renders the chat on the right.
 */
export default async function ConversationsLayout({ children }: { children: React.ReactNode }) {
  // GET /conversation/user
  const [response, token] = await Promise.all([
    $SERVICE_REPOSITORY.Conversations.getUserConversations({ page: "1", limit: String(LIMIT) }),
    getMyToken(),
  ]);

  const result = response.ok ? response.data.data : null;

  return (
    <ConversationsShell
      meId={token?.userId ?? ""}
      initialConversations={result?.data ?? []}
      initialTotal={result?.meta.total ?? 0}
      initialTotalPages={result?.meta.totalPages ?? 1}
      initialError={response.ok ? undefined : response.error.message}
      limit={LIMIT}
    >
      {children}
    </ConversationsShell>
  );
}
