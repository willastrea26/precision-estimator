import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — A-Precision" }] }),
  component: () => (
    <EmptyState
      icon={LayoutDashboard}
      title="Your dashboard will appear here"
      description="Once you add projects, key metrics and activity will show up here."
    />
  ),
});
