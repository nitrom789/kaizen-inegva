"use client";

import { useEffect, useState } from "react";

import * as XLSX from "xlsx";

import { saveAs } from "file-saver";

import { Button } from "@/components/ui/button";

import { EmployeeAvatar } from "@/components/ui/EmployeeAvatar";

import { supabase } from "@/lib/supabase";

import { toast } from "sonner";

type Employee = {
  id: number;
  full_name: string;
  pin_code: string;
  site_id: number;
  photo_url?: string;
};

export function EmployeeForm() {

  const [fullName, setFullName] =
    useState("");

  const [photoFile, setPhotoFile] =
    useState<File | null>(null);

  const [siteId, setSiteId] =
    useState("1");

  const [loading, setLoading] =
    useState(false);

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees =
    async () => {

      const {
        data,
      } = await supabase
        .from("employees")
        .select("*")
        .order(
          "full_name"
        );

      if (!data) {
        return;
      }

      setEmployees(data);
    };

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

  const handleDelete =
    async (id: number) => {

      const confirmed =
        confirm(
          "Удалить сотрудника?"
        );

      if (!confirmed) {
        return;
      }

      const { error } =
        await supabase
          .from("employees")
          .delete()
          .eq("id", id);

      if (error) {

        console.error(error);

        toast.error(
          "Ошибка удаления"
        );

        return;
      }

      toast.success(
        "Сотрудник удален"
      );

      fetchEmployees();
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

    let uploadedPhotoUrl = "";

    if (photoFile) {

      const fileExt =
        photoFile.name
          .split(".")
          .pop();

      const fileName =
        `${Date.now()}.${fileExt}`;

      const {
        error: uploadError,
      } = await supabase
        .storage
        .from("employee-photos")
        .upload(
          fileName,
          photoFile
        );

      if (uploadError) {

        console.error(uploadError);

        toast.error(
          "Ошибка загрузки фото"
        );

        setLoading(false);

        return;
      }

      const {
        data: publicUrlData,
      } = supabase
        .storage
        .from("employee-photos")
        .getPublicUrl(fileName);

      uploadedPhotoUrl =
        publicUrlData.publicUrl;
    }

    const { error } =
      await supabase
        .from("employees")
        .insert([
          {
            full_name:
              fullName.trim(),

            photo_url:
              uploadedPhotoUrl,

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
    setPhotoFile(null);
    setSiteId("1");

    fetchEmployees();
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

            Фото сотрудника

          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {

              const file =
                e.target.files?.[0];

              if (!file) {
                return;
              }

              setPhotoFile(file);
            }}
            className="w-full h-12 rounded-xl border px-4 py-2"
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

      <div className="bg-white rounded-2xl p-5 shadow-xl space-y-5">

        <h2 className="text-xl font-semibold">

          Список сотрудников

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {employees.map((item) => (

            <div
              key={item.id}
              className="border rounded-2xl p-4 flex gap-4 items-start"
            >

              <EmployeeAvatar
                photoUrl={item.photo_url}
                fullName={item.full_name}
                width={72}
                height={96}
              />

              <div className="flex-1 space-y-2">

                <div>

                  <h3 className="font-semibold text-lg">

                    {item.full_name}

                  </h3>

                  <p className="text-sm text-gray-500">

                    {item.site_id === 1
                      ? "Арго"
                      : "Буковая"}

                  </p>

                </div>

                <div className="bg-gray-100 rounded-xl px-3 py-2 inline-block">

                  <p className="text-sm text-gray-500">

                    PIN-код

                  </p>

                  <p className="font-bold text-lg">

                    {item.pin_code}

                  </p>

                </div>

                <button
                  onClick={() =>
                    handleDelete(
                      item.id
                    )
                  }
                  className="h-10 px-4 rounded-xl bg-red-600 text-white text-sm font-medium"
                >

                  Удалить

                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}