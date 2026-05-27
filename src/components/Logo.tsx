import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md";
  align?: "left" | "center";
  className?: string;
}

export function Logo({ size = "md", align = "left", className }: LogoProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <span
        className={cn(
          "font-bold tracking-tight text-foreground leading-none",
          size === "md" ? "text-2xl" : "text-xl",
        )}
      >
        A-Precision
      </span>
      <span className="mt-1.5 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-primary leading-none">
        Civil Estimating Intelligence
      </span>
    </div>
  );
}
