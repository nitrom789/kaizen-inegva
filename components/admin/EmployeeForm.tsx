"use client";

import { useState } from "react";

import * as XLSX from "xlsx";

import { saveAs } from "file-saver";

import { Button } from "@/components/ui/button";

import { supabase } from "@/lib/supabase";

import { toast } from "sonner";

type Employee = {
  id: number;
  full_name: string;
  pin_code: string;
  site_id: number;
};

export function EmployeeForm() {

  const [fullName, setFullName] =
    useState("");

  const [photoUrl, setPhotoUrl] =
    useState("");

  const [siteId, setSiteId] =
    useState("1");

  const [loading, setLoading] =
    useState(false);

  const generateUniquePin =
    async () => {

      let pinCode = "";

      let isUnique = false;

      while (!isUnique) {

        pinCode =
          Math.floor(
            1000 +
            Math.random() * 9000
          ).toString();

        const { data } =
          await supabase
            .from("employees")
            .select("id")
            .eq(
              "pin_code",
              pinCode
            )
            .maybeSingle();

        if (!data) {
          isUnique = true;
        }
      }

      return pinCode;
    };

  const exportPins = async (
    siteId: number,
    siteName: string
  ) => {

    const {
      data: employeesData,
    } = await supabase
      .from("employees")
      .select("*")
      .eq(
        "site_id",
        siteId
      )
      .order("full_name");

    if (!employeesData) {
      return;
    }

    const exportData =
      employeesData.map(
        (item: Employee) => ({
          "ФИО":
            item.full_name,

          "PIN-код":
            item.pin_code,
        })
      );

    const worksheet =
      XLSX.utils.json_to_sheet(
        exportData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "PIN-коды"
    );

    const excelBuffer =
      XLSX.write(
        workbook,
        {
          bookType: "xlsx",
          type: "array",
        }
      );

    const blob = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      }
    );

    saveAs(
      blob,
      `pins-${siteName}.xlsx`
    );
  };

  const handleSubmit = async () => {

    if (!fullName.trim()) {

      toast.error(
        "Введите имя сотрудника"
      );

      return;
    }

    setLoading(true);

    const pinCode =
      await generateUniquePin();

    const { error } =
      await supabase
        .from("employees")
        .insert([
          {
            full_name:
              fullName.trim(),

            photo_url:
              photoUrl.trim(),

            site_id:
              Number(siteId),

            pin_code:
              pinCode,
          },
        ]);

    setLoading(false);

    if (error) {

      console.error(error);

      toast.error(
        "Ошибка при добавлении"
      );

      return;
    }

    toast.success(
      `Сотрудник добавлен. PIN: ${pinCode}`
    );

    setFullName("");
    setPhotoUrl("");
    setSiteId("1");
  };

  return (
    <div className="space-y-6">

      <div className="bg-white rounded-2xl p-5 shadow-xl space-y-4">

        <h2 className="text-xl font-semibold">

          Добавить сотрудника

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
            placeholder="Введите ФИО"
            className="w-full h-12 rounded-xl border px-4"
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
            className="w-full h-12 rounded-xl border px-4"
          >

            <option value="1">
              Арго
            </option>

            <option value="2">
              Буковая
            </option>

          </select>

        </div>

        <div className="space-y-2">

          <label className="text-sm font-medium">

            Фото URL

          </label>

          <input
            value={photoUrl}
            onChange={(e) =>
              setPhotoUrl(
                e.target.value
              )
            }
            placeholder="https://..."
            className="w-full h-12 rounded-xl border px-4"
          />

        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full"
        >

          {loading
            ? "Добавление..."
            : "Добавить сотрудника"}

        </Button>

      </div>

      <div className="bg-white rounded-2xl p-5 shadow-xl space-y-4">

        <h2 className="text-xl font-semibold">

          Экспорт PIN-кодов

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <button
            onClick={() =>
              exportPins(
                1,
                "argo"
              )
            }
            className="h-12 rounded-xl bg-blue-600 text-white font-medium"
          >

            Экспорт Арго

          </button>

          <button
            onClick={() =>
              exportPins(
                2,
                "bukovaya"
              )
            }
            className="h-12 rounded-xl bg-green-600 text-white font-medium"
          >

            Экспорт Буковая

          </button>

        </div>

      </div>

    </div>
  );
}