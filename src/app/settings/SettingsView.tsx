"use client";

import { useState } from "react";
import Link from "next/link";
import { FaChevronRight, FaLock, FaPalette, FaUser } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import Appearance from "@/components/appearance/Appearance";
import ChangePasswordForm from "@/components/change-password-form/ChangePasswordForm";
import UpdateProfileForm from "@/components/update-profile-form/UpdateProfileForm";
import { User } from "@/services/types/user_interface";

type Tab = "profile" | "password" | "appearance";

const TABS = [
  {
    id: "profile" as const,
    label: "Profile info",
    text: "Update personal details",
    icon: FaUser,
    title: "Profile Information",
    description: "Update your personal details and account info.",
    active: "bg-main-color/10 text-main-color border-main-color/20",
    iconActive: "bg-main-color/15 text-main-color",
  },
  {
    id: "password" as const,
    label: "Password",
    text: "Change account password",
    icon: FaLock,
    title: "Password & Security",
    description: "Manage your password and secure your account.",
    active: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
    iconActive: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  },
  {
    id: "appearance" as const,
    label: "Appearance",
    text: "Light, dark or system",
    icon: FaPalette,
    title: "Appearance & Theme",
    description: "Customize how the app looks on your device.",
    active: "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/20",
    iconActive: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300",
  },
];

export default function SettingsView({ user, initialTab }: { user: User; initialTab: Tab }) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const tab = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-4">
        {/* Tabs */}
        <aside className="md:col-span-1">
          <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
            <h2 className="mb-3 px-3 pt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Account Settings
            </h2>

            <nav className="grid gap-1 sm:grid-cols-3 md:grid-cols-1">
              {TABS.map((t) => {
                const active = activeTab === t.id;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    aria-current={active ? "page" : undefined}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-3 py-2.5 text-xs transition-all ${
                      active
                        ? `${t.active} font-semibold`
                        : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex size-8 items-center justify-center rounded-lg ${active ? t.iconActive : "bg-muted text-muted-foreground"}`}>
                        <Icon className="size-3.5" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">{t.label}</div>
                        <div className="hidden text-[10px] font-normal text-muted-foreground sm:block">{t.text}</div>
                      </div>
                    </div>
                    <FaChevronRight className={`hidden size-3 md:block ${active ? "" : "text-muted-foreground/50"}`} />
                  </button>
                );
              })}
            </nav>

            <div className="mt-3 border-t border-border pt-3">
              <Link
                href="/profile"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <FiUser className="size-3.5" />
                <span>View my profile</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Content */}
        <section className="md:col-span-3">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">{tab.title}</h1>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{tab.description}</p>
          </div>

          {activeTab === "profile" && (
            <div className="animate-in rounded-2xl border border-border bg-card p-6 shadow-sm duration-200 fade-in sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-main-color/10 text-main-color">
                  <FaUser className="size-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">Profile Details</h2>
                  <p className="text-xs text-muted-foreground">Update your personal information</p>
                </div>
              </div>
              <UpdateProfileForm user={user} />
            </div>
          )}

          {activeTab === "password" && (
            <div className="animate-in rounded-2xl border border-border bg-card p-6 shadow-sm duration-200 fade-in sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
                  <FaLock className="size-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">Change Password</h2>
                  <p className="text-xs text-muted-foreground">Update your account password</p>
                </div>
              </div>
              <ChangePasswordForm />
            </div>
          )}

          {activeTab === "appearance" && <Appearance />}
        </section>
      </div>
    </div>
  );
}
