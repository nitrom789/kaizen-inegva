"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { supabase } from "@/lib/supabase";

import { toast } from "sonner";

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
  );
}