import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export const Route = createFileRoute("/_authenticated/risks")({
  head: () => ({ meta: [{ title: "Risk Register — A-Precision" }] }),
  component: () => (
    <EmptyState
      icon={ShieldAlert}
      title="No risks recorded yet"
      description="Risks logged across all your projects will roll up here."
    />
  ),
});
