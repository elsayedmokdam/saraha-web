"use client";

import IsEmpty from "@/components/shared/is-empty/IsEmpty";
import AppButton from "@/components/shared/app-button/AppButton";
import { FiAlertTriangle } from "react-icons/fi";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <IsEmpty
        icon={<FiAlertTriangle />}
        title="Something went wrong"
        description={error.message || "An unexpected error occurred."}
      />
      <AppButton onClick={reset} className="-mt-8 bg-main-color text-white px-6 py-5 rounded-xl">
        Try again
      </AppButton>
    </div>
  );
}
