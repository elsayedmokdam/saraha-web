"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import UserAvatar from "@/components/shared/user-avatar/UserAvatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User } from "@/services/types/user_interface";
import type { Paginated } from "@/services/types/api_interface";
import { formatDate } from "@/services/utils/helpers/formatDate";
import {
  addUserAction,
  deleteUserAction,
  getAllUsersAction,
  updateUserAction,
} from "@/services/actions/user.action";
import { confirmDialog, notify } from "@/services/utils/helpers/alerts";
import AppButton from "@/components/shared/app-button/AppButton";

interface UsersTableProps {
  users: Paginated<User>;
}

type UserEditor = { mode: "add" } | { mode: "edit"; user: User } | null;

export default function UsersTable({ users }: UsersTableProps) {
  const [userPage, setUserPage] = useState(users);
  const [query, setQuery] = useState("");
  const [editor, setEditor] = useState<UserEditor>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [pageError, setPageError] = useState<string>();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return userPage.data;

    return userPage.data.filter(
      (u) =>
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u._id.includes(q),
    );
  }, [userPage.data, query]);

  async function loadPage(page: number, force = false) {
    if (
      isLoadingPage ||
      page < 1 ||
      page > userPage.meta.totalPages ||
      (!force && page === userPage.meta.page)
    ) {
      return;
    }

    setIsLoadingPage(true);
    setPageError(undefined);
    const result = await getAllUsersAction({
      page: String(page),
      limit: String(userPage.meta.limit),
    });
    setIsLoadingPage(false);

    if (!result.ok) {
      setPageError(result.error.message);
      return;
    }

    setUserPage(result.data.data);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor || isSaving) return;

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    setIsSaving(true);

    if (editor.mode === "add") {
      const password = String(formData.get("password") ?? "");
      const confirmPassword = String(formData.get("confirmPassword") ?? "");
      if (password !== confirmPassword) {
        setIsSaving(false);
        notify.error("Passwords do not match.");
        return;
      }

      const result = await addUserAction({
        username,
        email,
        password,
        confirmPassword,
      });

      setIsSaving(false);
      if (!result.ok) return notify.apiError(result.error);
      notify.success(result.data.message || "User added successfully.");
    } else {
      const result = await updateUserAction(editor.user._id, {
        username,
        email,
      });

      setIsSaving(false);
      if (!result.ok) return notify.apiError(result.error);
      notify.success(result.data.message || "User updated successfully.");
    }

    setEditor(null);
    if (editor.mode === "add") {
      await loadPage(1, true);
    } else {
      await loadPage(userPage.meta.page, true);
    }
  }

  async function handleDelete(user: User) {
    const confirmed = await confirmDialog({
      title: "Delete user?",
      text: `This will permanently delete ${user.username} (${user.email}).`,
      confirmText: "Delete user",
    });
    if (!confirmed) return;

    setDeletingUserId(user._id);
    const result = await deleteUserAction(user._id);
    setDeletingUserId(null);
    if (!result.ok) return notify.apiError(result.error);

    notify.success(result.data.message || "User deleted successfully.");
    const remainingTotal = Math.max(0, userPage.meta.total - 1);
    const remainingPages = Math.max(
      1,
      Math.ceil(remainingTotal / userPage.meta.limit),
    );
    const targetPage = Math.min(userPage.meta.page, remainingPages);
    await loadPage(targetPage, true);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email or id..."
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-main-color"
          />
        </div>

        <p className="text-sm text-muted-foreground">
          Total users:{" "}
          <span className="font-semibold text-foreground">
            {userPage.meta.total}
          </span>
        </p>

        <AppButton
          type="button"
          onClick={() => setEditor({ mode: "add" })}
          className="gap-2"
        >
          <FiPlus />
          Add user
        </AppButton>
      </div>

      {editor && (
        <form
          key={editor.mode === "edit" ? editor.user._id : "add-user"}
          onSubmit={handleSave}
          className="space-y-4 rounded-xl border border-border bg-card p-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">
              {editor.mode === "add" ? "Add user" : "Edit user"}
            </h2>
            <AppButton
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close user form"
              onClick={() => setEditor(null)}
            >
              <FiX />
            </AppButton>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Username</span>
              <input
                name="username"
                required
                defaultValue={
                  editor.mode === "edit" ? editor.user.username : ""
                }
                autoComplete="name"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main-color"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Email</span>
              <input
                name="email"
                type="email"
                required
                defaultValue={editor.mode === "edit" ? editor.user.email : ""}
                autoComplete="email"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main-color"
              />
            </label>
            {editor.mode === "add" && (
              <>
                <label className="space-y-1 text-sm">
                  <span className="text-muted-foreground">Password</span>
                  <input
                    name="password"
                    type="password"
                    required
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main-color"
                  />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="text-muted-foreground">
                    Confirm password
                  </span>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main-color"
                  />
                </label>
              </>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <AppButton
              type="button"
              variant="outline"
              onClick={() => setEditor(null)}
              disabled={isSaving}
            >
              Cancel
            </AppButton>
            <AppButton type="submit" disabled={isSaving}>
              {isSaving
                ? "Saving..."
                : editor.mode === "add"
                  ? "Add user"
                  : "Save changes"}
            </AppButton>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Email Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Id</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      name={u.username}
                      image={u.image}
                      className="size-9"
                    />
                    <div>
                      <p className="font-medium text-foreground">
                        {u.username}
                      </p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>{u.role === 1 ? "Admin" : "User"}</TableCell>
                <TableCell>{u.provider === 1 ? "Google" : "Email"}</TableCell>

                <TableCell>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      u.confirmEmail || u.isCreated
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                    }`}
                  >
                    {u.confirmEmail || u.isCreated ? "Confirmed" : "Pending"}
                  </span>
                </TableCell>

                <TableCell>{formatDate(u.createdAt)}</TableCell>

                <TableCell className="font-mono text-xs text-muted-foreground/70">
                  {u._id}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <AppButton
                      type="button"
                      variant="outline"
                      size="sm"
                      aria-label={`Edit ${u.username}`}
                      onClick={() => setEditor({ mode: "edit", user: u })}
                    >
                      <FiEdit2 />
                      Edit
                    </AppButton>
                    <AppButton
                      type="button"
                      variant="destructive"
                      size="sm"
                      aria-label={`Delete ${u.username}`}
                      disabled={deletingUserId === u._id}
                      onClick={() => void handleDelete(u)}
                    >
                      <FiTrash2 />
                      {deletingUserId === u._id ? "Deleting..." : "Delete"}
                    </AppButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-muted-foreground/70"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} users on this page
        </p>

        <div className="flex items-center gap-2">
          <AppButton
            type="button"
            disabled={userPage.meta.page <= 1 || isLoadingPage}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => void loadPage(userPage.meta.page - 1)}
          >
            <FiChevronLeft />
            Previous
          </AppButton>

          <AppButton
            type="button"
            disabled={
              userPage.meta.page >= userPage.meta.totalPages || isLoadingPage
            }
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => void loadPage(userPage.meta.page + 1)}
          >
            Next
            <FiChevronRight />
          </AppButton>
        </div>
      </div>
    </div>
  );
}
