"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import { toast } from "sonner";

type Employee = {
  id: number;
  full_name: string;
  pin_code: string;
  site_id: number;
};

type Props = {
  open: boolean;

  onClose: () => void;

  employee: Employee | null;

  onUpdated: () => void;
};

export function EditEmployeeDialog({
  open,
  onClose,
  employee,
  onUpdated,
}: Props) {

  const [fullName, setFullName] =
    useState("");

  const [pinCode, setPinCode] =
    useState("");

  const [siteId, setSiteId] =
    useState("1");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    if (!employee) {
      return;
    }

    setFullName(
      employee.full_name
    );

    setPinCode(
      employee.pin_code
    );

    setSiteId(
      String(employee.site_id)
    );

  }, [employee]);

  const handleSave = async () => {

    if (!employee) {
      return;
    }

    setLoading(true);

    const { error } =
      await supabase
        .from("employees")
        .update({
          full_name:
            fullName,

          pin_code:
            pinCode,

          site_id:
            Number(siteId),
        })
        .eq(
          "id",
          employee.id
        );

    setLoading(false);

    if (error) {

      console.error(error);

      toast.error(
        "Ошибка сохранения"
      );

      return;
    }

    toast.success(
      "Сотрудник обновлен"
    );

    onUpdated();

    onClose();
  };

  if (!open || !employee) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-5">

        <h2 className="text-2xl font-bold">

          Редактирование сотрудника

        </h2>

        <div className="space-y-2">

          <label className="text-sm font-medium">

            ФИО

          </label>

          <input
            value={fullName}
            onChange={(e) =>
              setFullName(
                e.target.value
              )
            }
            className="w-full h-11 rounded-xl border px-4"
          />

        </div>

        <div className="space-y-2">

          <label className="text-sm font-medium">

            PIN-код

          </label>

          <input
            value={pinCode}
            onChange={(e) =>
              setPinCode(
                e.target.value
              )
            }
            className="w-full h-11 rounded-xl border px-4"
          />

        </div>

        <div className="space-y-2">

          <label className="text-sm font-medium">

            Площадка

          </label>

          <select
            value={siteId}
            onChange={(e) =>
              setSiteId(
                e.target.value
              )
            }
            className="w-full h-11 rounded-xl border px-4"
          >

            <option value="1">
              Арго
            </option>

            <option value="2">
              Буковая
            </option>

          </select>

        </div>

        <div className="flex gap-3">

          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border"
          >

            Отмена

          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 h-11 rounded-xl bg-blue-600 text-white font-medium"
          >

            {loading
              ? "Сохранение..."
              : "Сохранить"}

          </button>

        </div>

      </div>

    </div>
  );
}