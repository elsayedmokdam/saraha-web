import { IdentityRequestStatus } from "@/services/types/enums";

const styles: Record<IdentityRequestStatus, string> = {
  pending: "bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300",
  accepted: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  rejected: "bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-300",
};

export default function StatusBadge({
  status,
  label = status,
}: {
  status: IdentityRequestStatus;
  label?: string;
}) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${styles[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {label}
    </span>
  );
}
