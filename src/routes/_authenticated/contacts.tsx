import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export const Route = createFileRoute("/_authenticated/contacts")({
  head: () => ({ meta: [{ title: "Contacts — A-Precision" }] }),
  component: () => (
    <EmptyState
      icon={Users}
      title="No contacts added yet"
      description="Add suppliers and subbies here to streamline quote requests."
    />
  ),
});
