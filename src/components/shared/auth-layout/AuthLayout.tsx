import Link from "next/link";
import { FaLock, FaUserSecret, FaComments } from "react-icons/fa6";

const highlights = [
  { icon: <FaUserSecret />, title: "Anonymous by default" },
  { icon: <FaLock />, title: "Secure sessions" },
  { icon: <FaComments />, title: "Chat if you both agree" },
];

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/** Two-column layout shared by the sign in / sign up / confirm email pages. */
export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <section className="min-h-[calc(100dvh-4rem)] py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          {/* Left Section */}
          <div className="hidden lg:block">
            <div className="rounded-[32px] bg-linear-to-br from-main-color to-fuchsia-500 p-16 text-white shadow-xl">
              <FaUserSecret className="size-20 mb-8 opacity-90" />
              <h1 className="text-4xl font-bold tracking-tight">
                Say what you really think. Anonymously.
              </h1>
              <p className="mt-6 text-lg text-white/85 leading-8">
                Receive honest messages from friends and colleagues, and decide
                for yourself when to find out who wrote them.
              </p>
            </div>

            <div className="mt-10 flex items-center justify-center gap-8">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <span className="text-main-color">{item.icon}</span>
                  <p className="font-semibold text-xs">{item.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:p-10">
            <div className="mb-8 text-center">
              <Link href="/" className="text-3xl font-semibold">
                <span className="text-main-color">Sara</span>
                <span className="text-foreground">ha</span>
              </Link>
              <p className="mt-4 font-bold text-2xl text-foreground">{title}</p>
              {subtitle && (
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>

            {children}

            {footer && (
              <>
                <div className="my-5 w-full h-px bg-linear-to-r from-transparent via-border to-transparent"></div>
                <div className="text-center text-sm text-muted-foreground">{footer}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
