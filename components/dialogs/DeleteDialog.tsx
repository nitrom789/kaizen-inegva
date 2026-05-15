"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

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

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent className="rounded-2xl">

        <DialogHeader>
          <DialogTitle>
            Удалить предложение?
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-500">
          Это действие нельзя отменить.
        </p>

        <div className="flex justify-end gap-3 pt-4">

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Отмена
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
          >
            Удалить
          </Button>

        </div>

      </DialogContent>

    </Dialog>
  );
}