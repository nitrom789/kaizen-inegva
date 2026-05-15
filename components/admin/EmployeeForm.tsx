"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

import { toast } from "sonner";

export function EmployeeForm() {

  const [fullName, setFullName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const handleSubmit = async () => {

    if (!fullName.trim()) {
      toast.error("Введите имя сотрудника");
      return;
    }

    const { error } = await supabase
      .from("employees")
      .insert([
        {
          full_name: fullName,
          photo_url: photoUrl,
        },
      ]);

    if (error) {
      console.error(error);
      toast.error("Ошибка при добавлении");
      return;
    }

    toast.success("Сотрудник добавлен");

    setFullName("");
    setPhotoUrl("");
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
            setFullName(e.target.value)
          }
          placeholder="Введите ФИО"
          className="w-full h-12 rounded-xl border px-4"
        />

      </div>

      <div className="space-y-2">

        <label className="text-sm font-medium">
          Фото URL
        </label>

        <input
          value={photoUrl}
          onChange={(e) =>
            setPhotoUrl(e.target.value)
          }
          placeholder="https://..."
          className="w-full h-12 rounded-xl border px-4"
        />

      </div>

      <Button
        onClick={handleSubmit}
        className="w-full"
      >
        Добавить сотрудника
      </Button>

    </div>
  );
}