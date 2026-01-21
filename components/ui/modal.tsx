"use client";

import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { Dialog, DialogContent } from "./dialog";

type ModalProps = {
  children: ReactNode;
};

export function Modal({ children }: ModalProps) {
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back();
    }
  };

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 flex flex-col gap-0">
        {children}
      </DialogContent>
    </Dialog>
  );
}
