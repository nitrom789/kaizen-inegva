"use client";

import { useEffect, useState } from "react";

import { useTranslation } from "@/hooks/useTranslation";

import * as XLSX from "xlsx";

import { saveAs } from "file-saver";

import { Button } from "@/components/ui/button";

import { EmployeeAvatar } from "@/components/ui/EmployeeAvatar";

import { supabase } from "@/lib/supabase";

import { toast } from "sonner";
import { EditEmployeeDialog } from "@/components/dialogs/EditEmployeeDialog";

type Employee = {
  id: number;
  full_name_ru: string;
  full_name_ua: string;
  full_name_en: string;
  pin_code: string;
  site_id: number;
  photo_url?: string;
};

export function EmployeeForm() {

  const { t } = useTranslation();

  const [fullNameRu, setFullNameRu] =
  useState("");

const [fullNameUa, setFullNameUa] =
  useState("");

const [fullNameEn, setFullNameEn] =
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
      .order("full_name_ua");

    if (!employeesData) {
      return;
    }

    const exportData =
      employeesData.map(
        (item: Employee) => ({
          "ФИО":
            item.full_name_ua,

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
          t.deleteEmployeeConfirm
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
          t.deleteError
        );

        return;
      }

      toast.success(
        t.employeeDeleted
      );

      fetchEmployees();
    };
    const transliterateUaToEn = (
  text: string
) => {

  const map: Record<string, string> = {
    А: "A", а: "a",
    Б: "B", б: "b",
    В: "V", в: "v",
    Г: "H", г: "h",
    Ґ: "G", ґ: "g",
    Д: "D", д: "d",
    Е: "E", е: "e",
    Є: "Ye", є: "ie",
    Ж: "Zh", ж: "zh",
    З: "Z", з: "z",
    И: "Y", и: "y",
    І: "I", і: "i",
    Ї: "Yi", ї: "i",
    Й: "Y", й: "i",
    К: "K", к: "k",
    Л: "L", л: "l",
    М: "M", м: "m",
    Н: "N", н: "n",
    О: "O", о: "o",
    П: "P", п: "p",
    Р: "R", р: "r",
    С: "S", с: "s",
    Т: "T", т: "t",
    У: "U", у: "u",
    Ф: "F", ф: "f",
    Х: "Kh", х: "kh",
    Ц: "Ts", ц: "ts",
    Ч: "Ch", ч: "ch",
    Ш: "Sh", ш: "sh",
    Щ: "Shch", щ: "shch",
    Ю: "Yu", ю: "iu",
    Я: "Ya", я: "ia",
    Ь: "", ь: "",
    "'": "",
    "’": "",
  };

  return text
    .split("")
    .map(
      (char) =>
        map[char] ?? char
    )
    .join("");
};
  const handleSubmit = async () => {

    if (
  !fullNameRu.trim() ||
  !fullNameUa.trim()
) {

      toast.error(
        t.enterEmployeeName
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
  full_name_ru:
    fullNameRu.trim(),

  full_name_ua:
    fullNameUa.trim(),

  full_name_en:
    fullNameEn.trim(),

  photo_url:
    uploadedPhotoUrl,

  site_id:
    Number(siteId),

  pin_code:
    pinCode,
}
        ]);

    setLoading(false);

    if (error) {

      console.error(error);

      toast.error(
        t.addError
      );

      return;
    }

    toast.success(
      `${t.employeeAdded}. PIN: ${pinCode}`
    );

    setFullNameRu("");
    setFullNameUa("");
    setFullNameEn("");
    setPhotoFile(null);
    setSiteId("1");

    fetchEmployees();
  };

  const filteredEmployees =
    employees.filter((item) => {

const matchesSearch =
  (
    item.full_name_ua ||
    item.full_name_ru ||
    item.full_name_en ||
    ""
  )
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

            {t.addEmployee}

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-2">

              <label className="text-sm font-medium">

                {t.fullName}

              </label>

              <input
                value={fullNameUa}
                onChange={(e) => {

  const value =
    e.target.value;

  setFullNameUa(value);

  setFullNameEn(
    transliterateUaToEn(
      value
    )
  );
}}
                placeholder={t.enterFullName}
                className="w-full h-11 rounded-xl border px-4"
              />

            </div>

            <div className="space-y-2">

              <label className="text-sm font-medium">

                {t.site}

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
                  {t.argo}
                </option>

                <option value="2">
                  {t.bukovaya}
                </option>

              </select>

            </div>

          </div>

          <div className="space-y-2">

            <label className="text-sm font-medium">

              {t.employeePhoto}

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
              ? t.adding
              : t.addEmployee}

          </Button>

        </div>

        <div className="bg-white rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between h-full">

          <h2 className="text-xl font-semibold">

            {t.exportPins}

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

              {t.exportArgo}

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

              {t.exportBukovaya}

            </button>

          </div>

        </div>

      </div>

      <div className="bg-white rounded-2xl p-5 shadow-xl space-y-5">

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

          <h2 className="text-xl font-semibold">

            {t.employeeList}

          </h2>

          <div className="flex flex-col md:flex-row gap-3">

            <input
              type="text"
              placeholder={t.searchEmployee}
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
                {t.allSites}
              </option>

              <option value="1">
                {t.argo}
              </option>

              <option value="2">
                {t.bukovaya}
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
                fullName={item.full_name_ua}
                width={56}
                height={72}
              />

              <div className="flex-1 min-w-0">

                <h3 className="font-semibold text-sm leading-tight">

                  {item.full_name_ua}

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

    {t.edit}

  </button>

  <button
    onClick={() =>
      handleDelete(item.id)
    }
    className="h-8 px-3 rounded-lg bg-red-600 text-white text-xs font-medium"
  >

    {t.delete}

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
                  {t.photo}
                </th>

                <th className="px-5 py-4 text-sm font-semibold">
                  {t.employee}
                </th>

                <th className="px-5 py-4 text-sm font-semibold">
                  {t.site}
                </th>

                <th className="px-5 py-4 text-sm font-semibold">
                  PIN
                </th>

                <th className="px-5 py-4 text-sm font-semibold text-right">
                  {t.actions}
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
                      fullName={item.full_name_ua}
                      width={44}
                      height={56}
                    />

                  </td>

                  <td className="px-5 py-3">

                    <div className="font-medium">

                      {item.full_name_ua}

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

      {t.edit}

    </button>

    <button
      onClick={() =>
        handleDelete(item.id)
      }
      className="h-9 px-4 rounded-xl bg-red-600 text-white text-sm font-medium"
    >

      {t.delete}

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