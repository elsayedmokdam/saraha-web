"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiEdit3,
  FiInbox,
  FiMessageCircle,
  FiSettings,
  FiShield,
  FiUserCheck,
} from "react-icons/fi";
import { FaUserSecret } from "react-icons/fa6";
import DropDown from "../drop-down/DropDown";
import ThemeToggle from "../theme/ThemeToggle";
import { Footer } from "../footer/Footer";
import { useAppSelector } from "@/redux/store/hooks";

export interface Viewer {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: number;
}

function Logo({ withText = true }: { withText?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Saraha home">
      <span className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-main-color to-fuchsia-500 text-white shadow-md">
        <FaUserSecret className="size-5" />
      </span>
      {withText && (
        <span className="text-xl font-bold text-foreground">
          <span className="text-main-color">Sara</span>ha
        </span>
      )}
    </Link>
  );
}

/**
 * Signed in  -> chat-app shell: icon rail on desktop, top bar + bottom tabs on mobile.
 * Signed out -> simple public header + footer.
 */
export default function AppShell({
  viewer,
  children,
}: {
  viewer: Viewer | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pending = useAppSelector((s) => s.requests.pendingCount);

  if (pathname.startsWith("/admin")) {
    return children;
  }

  /* ------------------------------ public ------------------------------ */
  if (!viewer) {
    return (
      <div className="flex min-h-dvh flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <Logo />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link href="/signin" className="hidden rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:text-main-color sm:block">
                Sign in
              </Link>
              <Link href="/signup" className="rounded-xl bg-main-color px-4 py-2 text-sm font-semibold text-white hover:bg-main-color/90">
                Get started
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    );
  }

  /* ----------------------------- signed in ---------------------------- */
  const items = [
    { href: "/conversations", label: "Chats", icon: FiMessageCircle, badge: 0 },
    { href: "/messages", label: "Inbox", icon: FiInbox, badge: 0 },
    { href: "/identity-requests", label: "Requests", icon: FiUserCheck, badge: pending },
    { href: "/messages/new", label: "New", icon: FiEdit3, badge: 0 },
  ];

  const isActive = (href: string) =>
    href === "/messages"
      ? pathname === "/messages"
      : pathname === href || pathname.startsWith(`${href}/`);

  // on mobile an open chat uses the whole screen (it has its own header and composer)
  const inChat = /^\/conversations\/[^/]+/.test(pathname);

  const Badge = ({ n }: { n: number }) =>
    n > 0 ? (
      <span className="absolute -right-3 -top-2 flex min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-4 text-white ring-2 ring-sidebar">
        {n > 9 ? "9+" : n}
      </span>
    ) : null;

  const railItem = (active: boolean) =>
    `group relative flex w-full flex-col items-center gap-1 rounded-xl px-1 py-2.5 text-[10px] font-semibold transition ${
      active
        ? "bg-accent text-accent-foreground"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`;

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {/* ---------------- desktop rail ---------------- */}
      <aside className="hidden w-20 shrink-0 flex-col items-center gap-2 border-r border-sidebar-border bg-sidebar px-2 py-4 md:flex">
        <Logo withText={false} />

        <nav className="mt-4 flex w-full flex-1 flex-col gap-1">
          {items.map(({ href, label, icon: Icon, badge }) => (
            <Link key={href} href={href} className={railItem(isActive(href))} aria-current={isActive(href) ? "page" : undefined}>
              <span className="relative">
                <Icon className="size-5" />
                <Badge n={badge} />
              </span>
              {label}
            </Link>
          ))}
          {viewer.role === 1 && (
            <Link href="/admin/users" className={railItem(pathname.startsWith("/admin"))}>
              <FiShield className="size-5" />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex flex-col items-center gap-2">
          <ThemeToggle side="right" />
          <Link
            href="/settings"
            aria-label="Settings"
            title="Settings"
            className={`flex size-10 items-center justify-center rounded-xl transition ${
              pathname.startsWith("/settings")
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <FiSettings className="size-5" />
          </Link>
          <DropDown user={viewer} side="right" />
        </div>
      </aside>

      {/* ---------------- content ---------------- */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* mobile top bar */}
        {!inChat && (
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:hidden">
            <Logo />
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <DropDown user={viewer} />
            </div>
          </header>
        )}

        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>

        {/* mobile bottom tabs */}
        {!inChat && (
          <nav className="flex shrink-0 items-stretch justify-around border-t border-border bg-card px-2 pb-[env(safe-area-inset-bottom)] md:hidden">
            {items.map(({ href, label, icon: Icon, badge }) => (
              <Link
                key={href}
                href={href}
                className={`relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-semibold ${
                  isActive(href) ? "text-main-color" : "text-muted-foreground"
                }`}
              >
                <span className="relative">
                  <Icon className="size-5" />
                  <Badge n={badge} />
                </span>
                {label}
              </Link>
            ))}
            <Link
              href="/settings"
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-semibold ${
                pathname.startsWith("/settings") ? "text-main-color" : "text-muted-foreground"
              }`}
            >
              <FiSettings className="size-5" />
              Settings
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
}
