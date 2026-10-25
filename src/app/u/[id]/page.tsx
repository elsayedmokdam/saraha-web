import PageHeader from "@/components/shared/page-header/PageHeader";
import SendMessageForm from "@/components/send-message-form/SendMessageForm";
import IsEmpty from "@/components/shared/is-empty/IsEmpty";
import { FaUserSecret } from "react-icons/fa6";
import { FiAlertCircle } from "react-icons/fi";

export const metadata = { title: "Send an anonymous message" };

/** Public share link: `/u/<userId>` (sending still requires an account, the API needs the sender's token). */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!/^[a-f\d]{24}$/i.test(id)) {
    return (
      <IsEmpty
        icon={<FiAlertCircle />}
        title="Invalid link"
        description="This share link is not valid."
        links={[{ label: "Back to Home", href: "/" }]}
      />
    );
  }

  return (
    <>
      <PageHeader
        icon={<FaUserSecret className="size-6" />}
        title="Send an anonymous message"
        subtitle="Be honest, be kind"
      />
      <section className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <SendMessageForm receiverId={id} />
        </div>
      </section>
    </>
  );
}
