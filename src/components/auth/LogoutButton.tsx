"use client";

import { useTransition } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";

interface Props {
  variant?: "default" | "ghost" | "outline";
  showLabel?: boolean;
  className?: string;
}

/**
 * Logout button — calls the logoutAction Server Action.
 * Used in AdminSidebar and AdminTopbar (Module 9).
 */
export function LogoutButton({
  variant = "ghost",
  showLabel = true,
  className,
}: Props): React.JSX.Element {
  const [isPending, startTransition] = useTransition();

  function handleLogout(): void {
    startTransition(async () => {
      await logoutAction();
    });
  }

  return (
    <Button
      variant={variant}
      onClick={handleLogout}
      disabled={isPending}
      className={className}
      aria-label="Sign out"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      {showLabel && (
        <span className="ml-2">{isPending ? "Signing out…" : "Sign out"}</span>
      )}
    </Button>
  );
}