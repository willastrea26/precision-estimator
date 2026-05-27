import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center px-6 py-16">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-foreground/[0.04]">
          <Icon className="!h-10 !w-10 text-foreground/15" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        {actionLabel && onAction ? (
          <Button onClick={onAction} className="mt-6 bg-blue-600 text-white hover:bg-blue-700">
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
