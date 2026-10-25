"use client";

import toast, { ToastOptions } from "react-hot-toast";
import type { HttpErrorShape } from "../http";

type ToastType = "success" | "error" | "loading" | "custom";

function showToast(type: ToastType, message: string, config?: ToastOptions) {
  switch (type) {
    case "success":
      return toast.success(message, config);
    case "error":
      return toast.error(message, config);
    case "loading":
      return toast.loading(message, config);
    default:
      return toast(message, config);
  }
}

export const notify = {
  success: (message: string): void => {
    showToast("success", message);
  },

  error: (message: string): void => {
    showToast("error", message);
  },

  info: (message: string): void => {
    showToast("custom", message);
  },

  loading: (message: string) => showToast("loading", message),

  /**
   * Shows an API error. When the API sent validation `issues`
   * (e.g. ["Only valid email is allowed."]) they are shown instead of the generic "Validation Error".
   */
  apiError: (error: Pick<HttpErrorShape, "message" | "issues">): void => {
    showToast(
      "error",
      error.issues?.length ? error.issues.join("\n") : error.message,
    );
  },
};

/**
 * Utility to handle promise-based notifications
 * @params promise - The promise to track
 * @params messages - Custom messages for loading, success, and error states
 * @returns The original promise result
 */
export function notifyPromise<T>(
  promise: Promise<T>,
  messages: {
    loading?: string;
    success: string;
    error: string;
  } = {
    loading: "Loading...",
    success: "Operation successful!",
    error: "Operation failed!",
  },
) {
  const toastId = notify.loading(messages.loading || "Loading...");
  return promise
    .then((data) => {
      toast.dismiss(toastId);
      notify.success(messages.success);
      return data;
    })
    .catch((error) => {
      toast.dismiss(toastId);
      notify.error(messages.error);
      throw error;
    });
}

/** SweetAlert confirmation dialog. Resolves `true` when the user confirms. */
export async function confirmDialog({
  title = "Are you sure?",
  text,
  confirmText = "Confirm",
  danger = true,
}: {
  title?: string;
  text: string;
  confirmText?: string;
  danger?: boolean;
}): Promise<boolean> {
  const { default: swal } = await import("sweetalert");
  const result = await swal({
    title,
    text,
    icon: "warning",
    buttons: ["Cancel", confirmText],
    dangerMode: danger,
  });
  return Boolean(result);
}
