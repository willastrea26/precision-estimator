import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export const Route = createFileRoute("/_authenticated/quotes")({
  head: () => ({ meta: [{ title: "All Quotes — A-Precision" }] }),
  component: () => (
    <EmptyState
      icon={FileText}
      title="No quote requests yet"
      description="Supplier and subcontractor quotes will appear here once you start requesting them."
    />
  ),
});
