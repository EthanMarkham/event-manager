import * as React from "react";
import { cn } from "@/lib/utils";

type AppBackgroundProps = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

export function AppBackground({
  children,
  className,
  contentClassName,
}: AppBackgroundProps) {
  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-app-gradient" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-app-grid opacity-70 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_76%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-background/35 backdrop-blur-[2px]"
      />
      <div className={cn("relative", contentClassName)}>{children}</div>
    </div>
  );
}

