import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type CommonModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  contentClassName?: string;
};

export const CommonModal = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  contentClassName
}: CommonModalProps) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
      <Dialog.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-[28px] bg-white/95 p-5 shadow-[0_25px_55px_rgba(0,0,0,0.3)] backdrop-blur-md",
          contentClassName
        )}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
            {description ? (
              <Dialog.Description className="text-sm text-slate-600">
                {description}
              </Dialog.Description>
            ) : null}
          </div>
          <Dialog.Close className="rounded p-1 text-slate-500 hover:bg-slate-100">
            <X size={18} />
          </Dialog.Close>
        </div>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
