import { cn } from "@/lib/utils/cn";
import type { AppointmentStatus } from "@/lib/utils/format";
import { formatStatus } from "@/lib/utils/format";

interface Props {
  status: AppointmentStatus;
  className?: string;
}

const statusStyles: Record<
  AppointmentStatus,
  { bg: string; color: string; border: string }
> = {
  confirmed: {
    bg: "color-mix(in srgb, var(--color-success) 10%, transparent)",
    color: "var(--color-success)",
    border: "color-mix(in srgb, var(--color-success) 30%, transparent)",
  },
  pending: {
    bg: "color-mix(in srgb, var(--color-warning) 10%, transparent)",
    color: "var(--color-warning)",
    border: "color-mix(in srgb, var(--color-warning) 30%, transparent)",
  },
  completed: {
    bg: "color-mix(in srgb, var(--color-text-muted) 10%, transparent)",
    color: "var(--color-text-muted)",
    border: "color-mix(in srgb, var(--color-text-muted) 30%, transparent)",
  },
  cancelled: {
    bg: "color-mix(in srgb, var(--color-danger) 10%, transparent)",
    color: "var(--color-danger)",
    border: "color-mix(in srgb, var(--color-danger) 30%, transparent)",
  },
  no_show: {
    bg: "color-mix(in srgb, var(--color-danger) 6%, transparent)",
    color: "var(--color-danger)",
    border: "color-mix(in srgb, var(--color-danger) 20%, transparent)",
  },
};

export function AppointmentStatusBadge({
  status,
  className,
}: Props): React.JSX.Element {
  const styles = statusStyles[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        className,
      )}
      style={{
        backgroundColor: styles.bg,
        color: styles.color,
        borderColor: styles.border,
      }}
    >
      {formatStatus(status)}
    </span>
  );
}