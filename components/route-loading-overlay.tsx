"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef, startTransition } from "react";
import { Loader2 } from "@/lib/ui/icons";

export function RouteLoadingOverlay() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const prevPathnameRef = useRef(pathname);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const skipNextLoadingRef = useRef(false);

  useEffect(() => {
    // Detect browser back/forward navigation
    const handlePopState = () => {
      skipNextLoadingRef.current = true;
      setIsLoading(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    // Show loading when pathname changes (catches router.push calls)
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      
      // Skip loading if this was triggered by closing a dialog
      if (skipNextLoadingRef.current) {
        skipNextLoadingRef.current = false;
        return;
      }
      
      // Clear any existing timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Show loading immediately (wrapped in startTransition to avoid cascading renders)
      startTransition(() => {
        setIsLoading(true);
      });
      
      // Hide overlay after route transition completes
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pathname]);

  if (!isLoading) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="sr-only">Loading page</span>
    </div>
  );
}
