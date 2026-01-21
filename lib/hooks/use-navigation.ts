"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function useNavigation() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const push = (href: string) => {
    startTransition(() => {
      router.push(href);
    });
  };

  const replace = (href: string) => {
    startTransition(() => {
      router.replace(href);
    });
  };

  const refresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return {
    push,
    replace,
    refresh,
    isPending,
  };
}
