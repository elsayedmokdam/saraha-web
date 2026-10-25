"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiUsers,
  FiGrid,
  FiSettings,
  FiShield,
  FiChevronRight,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useState } from "react";
import { FaHome } from "react-icons/fa";

const navigation = [
  {
    label: "Back To Home",
    href: "/",
    icon: FaHome,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: FiUsers,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentPage =
    navigation.find((item) => item.href === pathname)?.label ?? "Dashboard";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-main-color text-white">
            <FiShield size={19} />
          </span>
          <span className="font-bold">Admin Panel</span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileMenuOpen}
          className="flex size-10 items-center justify-center rounded-lg border border-border hover:bg-muted"
        >
          {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
          <Link
            href="/"
            className="flex h-20 items-center gap-3 border-b border-border px-6"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-main-color text-white shadow-sm">
              <FiShield size={21} />
            </span>
            <div>
              <p className="font-bold tracking-tight">Admin Panel</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Management Console
              </p>
            </div>
          </Link>

          <div className="flex-1 px-4 py-7">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Workspace
            </p>

            <nav className="space-y-1.5" aria-label="Admin navigation">
              {navigation.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                      active
                        ? "bg-main-color/10 text-main-color"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={19} />
                      {item.label}
                    </span>
                    {active && <FiChevronRight size={16} />}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-9 rounded-2xl border border-border bg-muted/40 p-4">
              <span className="mb-3 flex size-9 items-center justify-center rounded-xl bg-card text-main-color shadow-sm">
                <FiSettings size={18} />
              </span>
              <p className="text-sm font-semibold">Manage your platform</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Manage users and keep your platform organized.
              </p>
            </div>
          </div>

          {/* Admin Profile */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3 rounded-xl p-2">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-main-color/10 text-sm font-bold text-main-color">
                A
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">Administrator</p>
                <p className="text-xs text-muted-foreground">Admin account</p>
              </div>
              <span className="ml-auto size-2 rounded-full bg-emerald-500" />
            </div>
          </div>
        </aside>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/40"
            />

            <aside className="absolute bottom-0 left-0 top-0 flex w-72 max-w-[85vw] flex-col border-r border-border bg-card shadow-xl">
              <div className="flex h-16 items-center justify-between border-b border-border px-5">
                <span className="font-bold">Navigation</span>
                <button
                  type="button"
                  aria-label="Close navigation"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-2 hover:bg-muted"
                >
                  <FiX size={20} />
                </button>
              </div>

              <nav className="space-y-1 p-4" aria-label="Mobile navigation">
                {navigation.map((item) => {
                  const active =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${
                        active
                          ? "bg-main-color/10 text-main-color"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon size={19} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          <header className="hidden h-20 items-center justify-between border-b border-border bg-card/60 px-8 lg:flex">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Admin</span>
                <FiChevronRight size={13} />
                <span className="font-medium text-foreground">
                  {currentPage}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Welcome to your management workspace.
              </p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <FiShield size={14} />
              Admin Workspace
            </span>
          </header>

          <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8 xl:p-10">
            <div className="mb-6 lg:hidden">
              <p className="text-xs text-muted-foreground">
                Admin / {currentPage}
              </p>
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
