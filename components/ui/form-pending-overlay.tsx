"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "@/lib/ui/icons";
import { cn } from "@/lib/utils";

type FormPendingOverlayProps = {
  label?: string;
  className?: string;
};

export function FormPendingOverlay({
  label = "Loading",
  className,
}: FormPendingOverlayProps) {
  const { pending } = useFormStatus();

  if (!pending) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute inset-0 z-10 flex items-center justify-center rounded-md bg-background/40 text-foreground backdrop-blur-md",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
