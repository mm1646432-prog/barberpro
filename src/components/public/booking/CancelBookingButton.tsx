"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { cancelBookingAction } from "@/actions/bookings";

interface Props {
  cancelToken: string;
}

export function CancelBookingButton({ cancelToken }: Props): React.JSX.Element {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);

  function handleCancel(): void {
    setError(null);
    startTransition(async () => {
      const result = await cancelBookingAction(cancelToken);
      if (result.error !== null) {
        setError(result.error);
      } else {
        setCancelled(true);
      }
    });
  }

  if (cancelled) {
    return (
      <p
        className="py-3 text-center text-sm font-medium"
        style={{ color: "var(--color-success)" }}
      >
        ✓ Your booking has been cancelled.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {error !== null && (
        <p
          className="text-center text-xs"
          style={{ color: "var(--color-danger)" }}
          role="alert"
        >
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={handleCancel}
        disabled={isPending}
        className="flex w-full items-center justify-center rounded-lg border py-3 text-sm font-semibold transition-colors disabled:opacity-50"
        style={{
          borderColor: "var(--color-danger)",
          color: "var(--color-danger)",
          backgroundColor: "color-mix(in srgb, var(--color-danger) 5%, transparent)",
        }}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Cancelling…
          </>
        ) : (
          "Cancel Booking"
        )}
      </button>
    </div>
  );
}