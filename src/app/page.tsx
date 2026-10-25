import Link from "next/link";
import { FaUserSecret, FaLock, FaComments, FaImages } from "react-icons/fa6";
import { FiSend, FiInbox, FiUserCheck } from "react-icons/fi";
import FeatureCard from "@/components/shared/feature-card/FeatureCard";
import ShareLinkCard from "@/components/share-link-card/ShareLinkCard";
import { getMyToken } from "@/services/utils/helpers/getMyToken";

export default async function Page() {
  const token = await getMyToken();

  const steps = [
    { icon: <FiSend />, title: "1. Send", text: "Write an honest message (with images if you like) to anyone." },
    { icon: <FiUserCheck />, title: "2. Ask", text: "Receivers can ask “who sent this?” and the sender decides." },
    { icon: <FaComments />, title: "3. Chat", text: "If the sender accepts, both of you get a private conversation." },
  ];

  return (
    <>
      <section className="bg-linear-to-br from-main-color to-fuchsia-500 text-white">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <FaUserSecret className="mx-auto mb-6 size-16 opacity-90" />
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Honest messages. Optional identities.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/85">
            Receive anonymous messages and choose when (and if) to reveal who you are.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {token ? (
              <>
                <Link href="/messages" className="inline-flex items-center gap-2 rounded-xl bg-card px-7 py-3 font-semibold text-main-color hover:bg-white/90">
                  <FiInbox /> Open my messages
                </Link>
                <Link href="/messages/new" className="inline-flex items-center gap-2 rounded-xl border border-white/60 px-7 py-3 font-semibold hover:bg-white/10">
                  <FiSend /> Send a message
                </Link>
              </>
            ) : (
              <>
                <Link href="/signup" className="rounded-xl bg-card px-7 py-3 font-semibold text-main-color hover:bg-white/90">
                  Get started
                </Link>
                <Link href="/signin" className="rounded-xl border border-white/60 px-7 py-3 font-semibold hover:bg-white/10">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {token && (
        <section className="mx-auto -mt-8 max-w-3xl px-4">
          <ShareLinkCard userId={token.userId ?? ""} />
        </section>
      )}

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-foreground">How it works</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <FeatureCard key={s.title} icon={s.icon} title={s.title} subtitle={s.text} />
          ))}
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <FeatureCard icon={<FaUserSecret />} title="Anonymous by default" subtitle="Senders stay hidden until they agree." />
          <FeatureCard icon={<FaImages />} title="Images supported" subtitle="Attach JPEG or PNG images to messages." />
          <FeatureCard icon={<FaLock />} title="Secure sessions" subtitle="Tokens live in httpOnly cookies, with 2-step login." />
        </div>
      </section>
    </>
  );
}
