"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiRefreshCw, FiLogOut, FiClock } from "react-icons/fi";
import { MdDevices } from "react-icons/md";

import ProfileImageUploader from "@/components/profile-image-uploader/ProfileImageUploader";
import ShareLinkCard from "@/components/share-link-card/ShareLinkCard";
import AppButton from "@/components/shared/app-button/AppButton";

import { User } from "@/services/types/user_interface";
import { logoutAction } from "@/services/actions/auth.action";
import { confirmDialog, notify } from "@/services/utils/helpers/alerts";
import { formatDate } from "@/services/utils/helpers/formatDate";
import { LogoutAction } from "@/services/types/enums";

import { useAppDispatch } from "@/redux/store/hooks";
import { clearProfile } from "@/redux/store/slices/userSlice/UserSlice";
import { setPendingCount } from "@/redux/store/slices/requestsSlice/RequestsSlice";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 text-sm last:border-0">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 text-right font-medium text-foreground break-words">
        {value}
      </span>
    </div>
  );
}

function useCountdown(target?: number) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!target) return null;

  const s = Math.max(0, Math.floor((target - now) / 1000));

  return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
}

export default function ProfileView({ user }: { user: User }) {
  const { data: session, update } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [refreshing, setRefreshing] = useState(false);
  const remaining = useCountdown(session?.accessTokenExpires);

  async function handleLogout(action: LogoutAction) {
    const ok = await confirmDialog({
      text:
        action === 1
          ? "You will be logged out of ALL your devices."
          : "You will be logged out of this device.",
      confirmText: "Logout",
    });

    if (!ok) return;

    const res = await logoutAction(action);

    if (!res.ok) {
      notify.apiError(res.error);
      if (action === 1) return;
    }

    await signOut({ redirect: false });

    dispatch(clearProfile());
    dispatch(setPendingCount(0));

    router.push("/signin");
    router.refresh();
  }

  async function handleRefresh() {
    setRefreshing(true);

    const updated = await update({ action: "rotate" });

    setRefreshing(false);

    if (updated?.error) return;

    if (updated?.rotateStatus === "rotated") {
      notify.success("Session refreshed");
    } else if (updated?.rotateStatus === "still-valid") {
      notify.info(
        "Your session is still valid. It can be refreshed during its last 10 minutes.",
      );
    } else {
      notify.info("Could not refresh right now. Try again in a moment.");
    }
  }

  return (
    <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 px-4 py-6 sm:gap-6 sm:px-6 sm:py-8 lg:grid-cols-3 lg:py-10">
      {/* Main Content */}
      <div className="min-w-0 space-y-5 sm:space-y-6 lg:col-span-2">
        {/* Profile Information */}
        <div className="w-full min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <div className="flex min-w-0 flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-5 sm:text-left">
            <div className="shrink-0">
              <ProfileImageUploader name={user.username} image={user.image} />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="break-words text-xl font-bold text-foreground sm:text-2xl">
                {user.username}
              </h2>

              <p className="mt-1 break-all text-sm text-muted-foreground">
                {user.email}
              </p>

              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {user.role === 1 ? "Admin" : "User"}
                </span>

                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {user.provider === 1 ? "Google" : "Email"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 border-t border-border pt-2 sm:mt-6">
            <Row label="First name" value={user.firstName} />
            <Row label="Last name" value={user.lastName} />
            <Row label="Gender" value={user.gender === 1 ? "Female" : "Male"} />
            <Row label="Date of birth" value={formatDate(user.DOB)} />
            <Row
              label="Email confirmed"
              value={user.confirmEmail ? formatDate(user.confirmEmail) : "No"}
            />
            <Row label="Member since" value={formatDate(user.createdAt)} />
          </div>
        </div>

        {/* Security */}
        <div className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Session & security
          </h3>

          <div className="mb-5 flex flex-col gap-4 rounded-xl bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <FiClock className="shrink-0 text-primary" size={20} />

              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Access token expires in
                </p>

                <p className="font-mono text-sm text-muted-foreground">
                  {remaining ?? "—"}
                </p>
              </div>
            </div>

            <AppButton
              onClick={handleRefresh}
              loading={refreshing}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 sm:w-auto"
            >
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
              Refresh now
            </AppButton>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <AppButton
              onClick={() => handleLogout(0)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-destructive/10 px-3 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
            >
              <FiLogOut />
              Log out of this device
            </AppButton>

            <AppButton
              onClick={() => handleLogout(1)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-destructive px-3 py-3 text-sm font-medium text-white transition-colors hover:opacity-90"
            >
              <MdDevices size={18} />
              Log out of all devices
            </AppButton>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="min-w-0 space-y-5 sm:space-y-6">
        <ShareLinkCard userId={user._id} />

        <div className="min-w-0 rounded-2xl border border-border bg-card p-4 text-sm shadow-sm sm:p-5">
          <p className="font-semibold text-foreground">Your user id</p>

          <p className="mt-2 break-all font-mono text-xs leading-relaxed text-muted-foreground">
            {user._id}
          </p>

          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Others need this id to message you (it is inside your link).
          </p>
        </div>
      </div>
    </section>
  );
}
