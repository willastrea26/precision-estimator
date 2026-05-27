import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/Logo";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* Blueprint grid overlay */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="ap-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ap-grid)" />
      </svg>

      <Card className="relative z-10 w-full max-w-[400px] border-border bg-card shadow-2xl">
        <CardContent className="p-8">
          <div className="mb-8 flex justify-center">
            <Logo align="center" />
          </div>
          <div className="mb-6 text-center">
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            {subtitle ? (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          {children}
          {footer ? (
            <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
