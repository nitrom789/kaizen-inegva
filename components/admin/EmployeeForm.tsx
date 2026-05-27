"use client";

import { useEffect, useState } from "react";

import * as XLSX from "xlsx";

import { saveAs } from "file-saver";

import { Button } from "@/components/ui/button";

import { EmployeeAvatar } from "@/components/ui/EmployeeAvatar";

import { supabase } from "@/lib/supabase";

import { toast } from "sonner";
import { EditEmployeeDialog } from "@/components/dialogs/EditEmployeeDialog";

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

  const [search, setSearch] =
    useState("");

  const [filterSite, setFilterSite] =
    useState("all");
    
  const [editOpen, setEditOpen] =
  useState(false);

  const [selectedEmployee,
  setSelectedEmployee] =
  useState<Employee | null>(
    null
  );

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

  const filteredEmployees =
    employees.filter((item) => {

      const matchesSearch =
        item.full_name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesSite =
        filterSite === "all"
          ? true
          : String(item.site_id) ===
            filterSite;

      return (
        matchesSearch &&
        matchesSite
      );
    });

  return (
    <div className="space-y-6 max-w-6xl">

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">

        <div className="bg-white rounded-2xl p-5 shadow-xl space-y-5">

          <h2 className="text-xl font-semibold">

            Добавить сотрудника

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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

          </div>

          <div className="space-y-2">

            <label className="text-sm font-medium">

              Фото сотрудника

            </label>

            <div className="space-y-3">

  <label
    htmlFor="employee-photo-upload"
    className="h-11 px-4 rounded-xl border flex items-center justify-center cursor-pointer hover:bg-gray-50 transition text-sm font-medium"
  >

    📷 Выбрать фото

  </label>

  <input
    id="employee-photo-upload"
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
    className="hidden"
  />

  {photoFile && (

    <div className="text-sm text-gray-500 break-all">

      {photoFile.name}

    </div>

  )}

</div>

          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-11"
          >

            {loading
              ? "Добавление..."
              : "Добавить сотрудника"}

          </Button>

        </div>

        <div className="bg-white rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between h-full">

          <h2 className="text-xl font-semibold">

            Экспорт PIN-кодов

          </h2>

          <div className="flex flex-col gap-3">

            <button
              onClick={() =>
                exportPins(
                  1,
                  "argo"
                )
              }
              className="h-11 px-6 rounded-xl bg-blue-600 text-white font-medium"
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
              className="h-11 px-6 rounded-xl bg-green-600 text-white font-medium"
            >

              Экспорт Буковая

            </button>

          </div>

        </div>

      </div>

      <div className="bg-white rounded-2xl p-5 shadow-xl space-y-5">

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

          <h2 className="text-xl font-semibold">

            Список сотрудников

          </h2>

          <div className="flex flex-col md:flex-row gap-3">

            <input
              type="text"
              placeholder="Поиск сотрудника..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="h-11 rounded-xl border px-4 w-[260px]"
            />

            <select
              value={filterSite}
              onChange={(e) =>
                setFilterSite(
                  e.target.value
                )
              }
              className="h-11 rounded-xl border px-4"
            >

              <option value="all">
                Все площадки
              </option>

              <option value="1">
                Арго
              </option>

              <option value="2">
                Буковая
              </option>

            </select>

          </div>

        </div>

        {/* MOBILE */}

        <div className="grid grid-cols-1 gap-3 md:hidden">

          {filteredEmployees.map((item) => (

            <div
              key={item.id}
              className="border rounded-2xl p-4 bg-white flex gap-4"
            >

              <EmployeeAvatar
                photoUrl={item.photo_url}
                fullName={item.full_name}
                width={56}
                height={72}
              />

              <div className="flex-1 min-w-0">

                <h3 className="font-semibold text-sm leading-tight">

                  {item.full_name}

                </h3>

                <p className="text-xs text-gray-500 mt-1">

                  {item.site_id === 1
                    ? "Арго"
                    : "Буковая"}

                </p>

                <div className="mt-3 inline-block bg-gray-100 rounded-lg px-2 py-1">

                  <p className="text-[10px] text-gray-500">

                    PIN-код

                  </p>

                  <p className="font-bold">

                    {item.pin_code}

                  </p>

                </div>

                <div className="mt-3 flex gap-2">

  <button
    onClick={() => {

      setSelectedEmployee(item);

      setEditOpen(true);
    }}
    className="h-8 px-3 rounded-lg bg-blue-600 text-white text-xs font-medium"
  >

    Изменить

  </button>

  <button
    onClick={() =>
      handleDelete(item.id)
    }
    className="h-8 px-3 rounded-lg bg-red-600 text-white text-xs font-medium"
  >

    Удалить

  </button>

</div>

              </div>

            </div>

          ))}

        </div>

        {/* DESKTOP */}

        <div className="hidden md:block overflow-hidden rounded-2xl border">

          <table className="w-full bg-white">

            <thead className="bg-gray-50 border-b">

              <tr className="text-left">

                <th className="px-5 py-4 text-sm font-semibold">
                  Фото
                </th>

                <th className="px-5 py-4 text-sm font-semibold">
                  Сотрудник
                </th>

                <th className="px-5 py-4 text-sm font-semibold">
                  Площадка
                </th>

                <th className="px-5 py-4 text-sm font-semibold">
                  PIN
                </th>

                <th className="px-5 py-4 text-sm font-semibold text-right">
                  Действия
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredEmployees.map((item) => (

                <tr
                  key={item.id}
                  className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                >

                  <td className="px-5 py-3">

                    <EmployeeAvatar
                      photoUrl={item.photo_url}
                      fullName={item.full_name}
                      width={44}
                      height={56}
                    />

                  </td>

                  <td className="px-5 py-3">

                    <div className="font-medium">

                      {item.full_name}

                    </div>

                  </td>

                  <td className="px-5 py-3 text-sm text-gray-600">

                    {item.site_id === 1
                      ? "Арго"
                      : "Буковая"}

                  </td>

                  <td className="px-5 py-3">

                    <div className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1.5 font-semibold">

                      {item.pin_code}

                    </div>

                  </td>

                  <td className="px-5 py-3 text-right">

  <div className="flex items-center justify-end gap-2">

    <button
      onClick={() => {

        setSelectedEmployee(item);

        setEditOpen(true);
      }}
      className="h-9 px-4 rounded-xl bg-blue-600 text-white text-sm font-medium"
    >

      Редактировать

    </button>

    <button
      onClick={() =>
        handleDelete(item.id)
      }
      className="h-9 px-4 rounded-xl bg-red-600 text-white text-sm font-medium"
    >

      Удалить

    </button>

  </div>

</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
        <EditEmployeeDialog
  open={editOpen}
  onClose={() =>
    setEditOpen(false)
  }
  employee={selectedEmployee}
  onUpdated={fetchEmployees}
/>
    </div>
  );
}