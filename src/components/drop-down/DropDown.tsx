"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { FiLogOut, FiSettings, FiShield, FiUser } from "react-icons/fi";
import { MdDevices } from "react-icons/md";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserAvatar from "../shared/user-avatar/UserAvatar";
import { logoutAction } from "@/services/actions/auth.action";
import { confirmDialog, notify } from "@/services/utils/helpers/alerts";
import { LogoutAction } from "@/services/types/enums";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { clearProfile } from "@/redux/store/slices/userSlice/UserSlice";
import { setPendingCount } from "@/redux/store/slices/requestsSlice/RequestsSlice";

interface DropDownProps {
  user: { name: string; email: string; image?: string | null; role?: number };
  side?: "top" | "right" | "bottom" | "left";
}

export default function DropDown({ user, side = "bottom" }: DropDownProps) {
  const route = useRouter();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user.profile);

  const name = profile?.username ?? user.name;
  const email = profile?.email ?? user.email;
  const image = profile?.image ?? user.image;

  async function handleLogout(action: LogoutAction) {
    const confirmed = await confirmDialog({
      text:
        action === 1
          ? "You will be logged out of ALL your devices."
          : "You will be logged out of this device.",
      confirmText: "Logout",
    });
    if (!confirmed) return;

    // Require server confirmation before claiming that every device was logged out.
    const res = await logoutAction(action);
    if (!res.ok) {
      notify.apiError(res.error);
      if (action === 1) return;
    }

    await signOut({ callbackUrl: "/signin", redirect: false });
    dispatch(clearProfile());
    dispatch(setPendingCount(0));
    route.push("/signin");
    route.refresh();
  }

  const item = "flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label="Account menu" className="cursor-pointer rounded-full ring-2 ring-transparent transition hover:ring-main-color/40">
          <UserAvatar name={name} image={image} className="size-10" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} align="end" className="w-72 rounded-2xl p-2">
        <div className="flex items-center gap-3 p-3">
          <UserAvatar name={name} image={image} className="size-11" />
          <div className="min-w-0 text-sm">
            <p className="truncate font-semibold text-foreground">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className={item}>
          <Link href="/profile"><FiUser /> Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className={item}>
          <Link href="/settings"><FiSettings /> Settings</Link>
        </DropdownMenuItem>
        {user.role === 1 && (
          <DropdownMenuItem asChild className={item}>
            <Link href="/admin/users"><FiShield /> Admin</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" className={item} onClick={() => handleLogout(0)}>
          <FiLogOut /> Log out
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" className={item} onClick={() => handleLogout(1)}>
          <MdDevices /> Log out of all devices
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
