"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

export function KaizenForm() {

  const [employeeId, setEmployeeId] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {

    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("full_name");

    if (error) {
      console.error(error);
      return;
    }

    setEmployees(data || []);
  };

  const handleSubmit = async () => {

    if (!employeeId || !category || !description) {
      toast.error("Заполните все поля");
      return;
    }

    const { error } = await supabase
      .from("improvements")
      .insert([
        {
          employee_id: employeeId,
          category,
          description,
          status: "Новая"
        },
      ]);

    if (error) {
      console.error(error);
      toast.error("Ошибка при отправке");
      return;
    }

    toast.success("Предложение успешно отправлено");

    setEmployeeId("");
    setCategory("");
    setDescription("");
  };

  return (
    <Card className="w-full max-w-md rounded-3xl shadow-2xl border-0 p-6 space-y-5">

      <div className="text-center space-y-2">

        <h1 className="text-2xl font-bold text-gray-900">
          Давайте делать производство лучше
        </h1>

        <p className="text-gray-500 text-sm">
          Подайте предложение по улучшению
        </p>

      </div>

      {/* Сотрудник */}
      <div className="space-y-2">

        <label className="text-sm font-medium">
          Сотрудник
        </label>

        <Popover>

  <PopoverTrigger asChild>

    <button
      type="button"
      className="w-full h-12 rounded-xl border px-4 bg-white flex items-center justify-between text-left"
    >

      <span className="truncate">

        {employeeId
          ? employees.find(
              (item) =>
                item.id.toString() === employeeId
            )?.full_name
          : "Выберите сотрудника"}

      </span>

    </button>

  </PopoverTrigger>

  <PopoverContent
    className="w-[350px] p-0"
  >

    <Command>

      <CommandInput
        placeholder="Введите фамилию..."
      />

      <CommandEmpty>
        Сотрудник не найден
      </CommandEmpty>

      <CommandGroup className="max-h-64 overflow-y-auto">

        {employees.map((item) => (

          <CommandItem
            key={item.id}
            value={item.full_name}
            onSelect={() =>
              setEmployeeId(
                item.id.toString()
              )
            }
          >

            {item.full_name}

          </CommandItem>

        ))}

      </CommandGroup>

    </Command>

  </PopoverContent>

</Popover>

      </div>

      {/* Категория */}
      <div className="space-y-2">

        <label className="text-sm font-medium">
          Категория улучшения
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full h-12 rounded-xl border px-4 bg-white"
        >

          <option value="">
            Выберите категорию
          </option>

          <option>
            Безопасность
          </option>

          <option>
            Качество
          </option>

          <option>
            Скорость
          </option>

          <option>
            Экономия
          </option>

          <option>
            Удобство
          </option>

        </select>

      </div>

      {/* Описание */}
      <div className="space-y-2">

        <label className="text-sm font-medium">
          Описание улучшения
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 min-h-[160px] resize-none"
          placeholder="Опишите ваше предложение..."
        />

      </div>

      <Button
        onClick={handleSubmit}
        className="w-full h-12 rounded-xl text-base"
      >
        Отправить предложение
      </Button>

    </Card>
  );
}