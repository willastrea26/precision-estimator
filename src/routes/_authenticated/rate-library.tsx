import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export const Route = createFileRoute("/_authenticated/rate-library")({
  head: () => ({ meta: [{ title: "Rate Library — A-Precision" }] }),
  component: () => (
    <EmptyState
      icon={BookOpen}
      title="No rates added yet"
      description="Build your civil estimating library to reuse rates across projects."
    />
  ),
});
