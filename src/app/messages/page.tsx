import PageHeader from "@/components/shared/page-header/PageHeader";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import Link from "next/link";
import { FiEdit3, FiInbox } from "react-icons/fi";
import MessagesList from "./MessagesList";

export const metadata = { title: "Inbox" };
const LIMIT = 10;

export default async function Page() {
  const response = await $SERVICE_REPOSITORY.Messages.getMessages({
    type: "2",
    page: "1",
    limit: String(LIMIT),
  });

  const initial = response.ok ? response.data.data : null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        icon={<FiInbox />}
        title="Inbox"
        subtitle="Everything you sent and received"
        actions={
          <Link
            href="/messages/new"
            className="flex items-center gap-2 rounded-xl bg-main-color px-4 py-2 text-sm font-semibold text-white hover:bg-main-color/90"
          >
            <FiEdit3 /> <span className="hidden sm:inline">New message</span>
          </Link>
        }
      />
      <MessagesList
        initialMessages={initial?.data ?? []}
        initialTotalPages={initial?.meta.totalPages ?? 1}
        initialError={response.ok ? undefined : response.error.message}
        limit={LIMIT}
      />
    </div>
  );
}
