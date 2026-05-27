import { createFileRoute } from "@tanstack/react-router";
import { Gauge } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export const Route = createFileRoute("/_authenticated/productivity-library")({
  head: () => ({ meta: [{ title: "Productivity Library — A-Precision" }] }),
  component: () => (
    <EmptyState
      icon={Gauge}
      title="No productivity assumptions added yet"
      description="Capture crew and plant productivity rates here for reuse in estimates."
    />
  ),
});
