"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { useTranslation } from "@/hooks/useTranslation";

type DeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
}: DeleteDialogProps) {

  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent className="rounded-2xl">

        <DialogHeader>

          <DialogTitle>

            {t.deleteProposal}

          </DialogTitle>

        </DialogHeader>

        <p className="text-sm text-gray-500">

          {t.deleteWarning}

        </p>

        <div className="flex justify-end gap-3 pt-4">

          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
          >

            {t.cancel}

          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
          >

            {t.delete}

          </Button>

        </div>

      </DialogContent>

    </Dialog>
  );
}