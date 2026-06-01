import { useEffect, useState } from "react";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";

import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    // Only check auth on the client. On the server the Supabase browser
    // client has no access to localStorage, so it would always think the
    // user is signed out and redirect to /login — causing a flicker loop
    // once the client hydrates and finds the real session.
    if (typeof window === "undefined") {
      return { user: null as User | null };
    }
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/login" });
    }
    return { user: data.session.user as User | null };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const ctx = Route.useRouteContext() as { user: User };
  const [user, setUser] = useState<User | null>(ctx.user);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AppShell user={user}>
      <Outlet />
    </AppShell>
  );
}
