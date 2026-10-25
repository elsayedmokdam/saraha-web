import PageHeader from "@/components/shared/page-header/PageHeader";
import SendMessageForm from "@/components/send-message-form/SendMessageForm";
import { FiSend } from "react-icons/fi";

export const metadata = { title: "Send a message" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ to?: string }>;
}) {
  const { to } = await searchParams;

  return (
    <>
      <PageHeader
        icon={<FiSend className="size-6" />}
        title="Send a message"
        subtitle="They will not see who you are unless you both agree"
      />
      <section className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <SendMessageForm receiverId={to && /^[a-f\d]{24}$/i.test(to) ? to : undefined} />
        </div>
      </section>
    </>
  );
}
