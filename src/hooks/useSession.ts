"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
interface SessionState {
  user: User | null;
  loading: boolean;
}

/**
 * Returns the current Supabase auth session for use in Client Components.
 *
 * - `loading: true` while the session is being resolved on mount.
 * - `user: null` when unauthenticated.
 * - Subscribes to auth state changes (login, logout, token refresh).
 */
export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    const supabase = createClient();

    void supabase.auth.getUser().then(({ data }) => {
      setState({ user: data.user, loading: false });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        loading: false,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return state;
}