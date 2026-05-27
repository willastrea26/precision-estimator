import { createFileRoute } from "@tanstack/react-router";
import { FolderKanban } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export const Route = createFileRoute("/_authenticated/projects")({
  head: () => ({ meta: [{ title: "Projects — A-Precision" }] }),
  component: () => (
    <EmptyState
      icon={FolderKanban}
      title="No projects yet"
      description="Create your first tender to begin."
    />
  ),
});
