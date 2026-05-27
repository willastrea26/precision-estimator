import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — A-Precision" }] }),
  component: SettingsPage,
});

const dateFmt = new Intl.DateTimeFormat("en-AU", { dateStyle: "long" });

function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const email = user?.email ?? "—";
  const companyName =
    (user?.user_metadata as { company_name?: string } | undefined)?.company_name ?? "—";
  const memberSince = user?.created_at ? dateFmt.format(new Date(user.created_at)) : "—";

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your account at a glance. Full settings coming soon.
        </p>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base text-foreground">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Row label="Logged in as" value={email} />
          <Row label="Company" value={companyName} />
          <Row label="Member since" value={memberSince} />
        </CardContent>
      </Card>

      <p className="mt-6 text-xs text-muted-foreground">Full settings coming soon.</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-sm text-foreground sm:col-span-2">{value}</div>
    </div>
  );
}
