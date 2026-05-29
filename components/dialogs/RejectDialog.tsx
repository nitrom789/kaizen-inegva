"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { useTranslation } from "@/hooks/useTranslation";

type RejectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
};

export function RejectDialog({
  open,
  onOpenChange,
  onConfirm,
}: RejectDialogProps) {

  const { t } = useTranslation();

  const [reason, setReason] =
    useState("");

  const handleConfirm = () => {

    if (!reason.trim()) {
      return;
    }

    onConfirm(reason);

    setReason("");

    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent className="sm:max-w-md">

        <DialogHeader>

          <DialogTitle>

            {t.rejectReason}

          </DialogTitle>

        </DialogHeader>

        <textarea
          value={reason}
          onChange={(e) =>
            setReason(
              e.target.value
            )
          }
          placeholder={
            t.enterRejectReason
          }
          className="w-full min-h-[140px] rounded-xl border px-4 py-3 resize-none"
        />

        <Button
          onClick={handleConfirm}
          className="w-full"
        >

          {t.confirmReject}

        </Button>

      </DialogContent>

    </Dialog>
  );
}