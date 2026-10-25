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
    <div className="flex items-center justify-between border-b border-border py-3 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
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
      text: action === 1 ? "You will be logged out of ALL your devices." : "You will be logged out of this device.",
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

  // Asks NextAuth to rotate the API tokens now (POST /user/rotate-token happens in the jwt callback)
  async function handleRefresh() {
    setRefreshing(true);
    const updated = await update({ action: "rotate" });
    setRefreshing(false);

    if (updated?.error) return; // SessionGuard signs the user out
    if (updated?.rotateStatus === "rotated") notify.success("Session refreshed");
    else if (updated?.rotateStatus === "still-valid")
      notify.info("Your session is still valid. It can be refreshed during its last 10 minutes.");
    else notify.info("Could not refresh right now. Try again in a moment.");
  }

  return (
    <section className="mx-auto grid max-w-5xl gap-6 px-4 py-10 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-5">
            <ProfileImageUploader name={user.username} image={user.image} />
            <div>
              <h2 className="text-2xl font-bold text-foreground">{user.username}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-2 flex gap-2">
                <span className="rounded-full bg-main-color/10 px-3 py-1 text-xs font-semibold text-main-color">
                  {user.role === 1 ? "Admin" : "User"}
                </span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {user.provider === 1 ? "Google" : "Email"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Row label="First name" value={user.firstName} />
            <Row label="Last name" value={user.lastName} />
            <Row label="Gender" value={user.gender === 1 ? "Female" : "Male"} />
            <Row label="Date of birth" value={formatDate(user.DOB)} />
            <Row label="Email confirmed" value={user.confirmEmail ? formatDate(user.confirmEmail) : "No"} />
            <Row label="Member since" value={formatDate(user.createdAt)} />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Session & security</h3>

          <div className="mb-5 flex items-center justify-between rounded-xl bg-muted/50 p-4">
            <div className="flex items-center gap-3 text-sm">
              <FiClock className="text-main-color" />
              <div>
                <p className="font-medium text-foreground">Access token expires in</p>
                <p className="font-mono text-muted-foreground">{remaining ?? "—"}</p>
              </div>
            </div>
            <AppButton
              onClick={handleRefresh}
              loading={refreshing}
              className="rounded-lg bg-main-color/10 px-4 py-2 text-sm font-medium text-main-color hover:bg-main-color/20"
            >
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} /> Refresh now
            </AppButton>
          </div>

          <div className="flex flex-wrap gap-3">
            <AppButton
              onClick={() => handleLogout(0)}
              className="rounded-lg bg-red-50 dark:bg-red-500/15 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/15"
            >
              <FiLogOut /> Log out of this device
            </AppButton>
            <AppButton
              onClick={() => handleLogout(1)}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              <MdDevices /> Log out of all devices
            </AppButton>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <ShareLinkCard userId={user._id} />
        <div className="rounded-2xl border border-border bg-card p-5 text-sm shadow-sm">
          <p className="font-semibold text-foreground">Your user id</p>
          <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{user._id}</p>
          <p className="mt-2 text-xs text-muted-foreground/70">
            Others need this id to message you (it is inside your link).
          </p>
        </div>
      </div>
    </section>
  );
}
