"use client";

import { useEffect, useState } from "react";
import { useTranslation }
  from "@/hooks/useTranslation"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type Employee = {
  id: number;
  full_name_ru: string;
  full_name_ua: string;
  full_name_en: string;
  site_id: number;
};

type KaizenFormProps = {
  siteId?: number;
};

export function KaizenForm({
  siteId,
}: KaizenFormProps) {

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [employeeId, setEmployeeId] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [open, setOpen] =
  useState(false);

    const { t } = useTranslation();
  
  const getEmployeeName = (
  employee: Employee
) => {

  const language =
    localStorage.getItem(
      "language"
    ) || "ru";

  if (language === "ua") {
    return employee.full_name_ua;
  }

  if (language === "en") {
    return employee.full_name_en;
  }

  return employee.full_name_ru;
};

const categories = [
  {
    db: "Безопасность",
    text: t.categorySafety,
  },
  {
    db: "Качество",
    text: t.categoryQuality,
  },
  {
    db: "Скорость",
    text: t.categorySpeed,
  },
  {
    db: "Экономия",
    text: t.categorySavings,
  },
  {
    db: "Удобство",
    text: t.categoryConvenience,
  },
];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {

    let query = supabase
      .from("employees")
      .select("*")
      .order("full_name_ua");

    if (siteId) {
      query = query.eq("site_id", siteId);
    }

    const { data, error } =
      await query;

    if (error) {
      console.error(error);
      return;
    }

    setEmployees(data || []);
  };

  const selectedEmployee =
  employees.find(
    (item) =>
      item.id.toString() ===
      employeeId
  );

  const handleSubmit = async () => {

    if (
      !employeeId ||
      !category ||
      !description
    ) {
      toast.error(
        t.fillAllFields
      );

      return;
    }

    const selectedEmployee =
      employees.find(
        (item) =>
          item.id.toString() ===
          employeeId
      );

    if (!selectedEmployee) {

      toast.error(
        t.employeeNotFoundError
      );

      return;
    }

    const { error } =
      await supabase
        .from("improvements")
        .insert([
          {
            employee_id:
              employeeId,

            category,

            description,

            status: "Новая",

            site_id:
              selectedEmployee.site_id,
          },
        ]);

    if (error) {

      console.error(error);

      toast.error(
        t.submitError
      );

      return;
    }

    toast.success(
      t.suggestionSent
    );

    setEmployeeId("");
    setCategory("");
    setDescription("");
  };

  return (
    <Card className="w-full max-w-md rounded-3xl shadow-2xl border-0 p-6 space-y-5">

      <div className="text-center space-y-2">

        <h1 className="text-2xl font-bold text-gray-900">
          {t.makeProductionBetter}
        </h1>

        <p className="text-gray-500 text-sm">
          {t.submitImprovement}
        </p>

      </div>

      {/* Сотрудник */}
      <div className="space-y-2">

        <label className="text-sm font-medium">
          {t.employee}
        </label>

        <Popover
          open={open}
          onOpenChange={setOpen}
        >

          <PopoverTrigger asChild>

            <button
              type="button"
              className="w-full h-12 rounded-xl border px-4 bg-white flex items-center justify-between text-left"
            >

              <span className="truncate">

  {selectedEmployee
    ? getEmployeeName(
        selectedEmployee
      )
    : t.selectEmployee}

</span>

            </button>

          </PopoverTrigger>

          <PopoverContent className="w-[350px] p-0">

            <Command>

              <CommandInput
                placeholder={t.enterSurname}
              />

              <CommandEmpty>
                {t.employeeNotFound}
              </CommandEmpty>

              <CommandGroup className="max-h-64 overflow-y-auto">

                {employees.map(
                  (item) => (

                    <CommandItem
                      key={item.id}
                      value={
                       getEmployeeName(
                          item
                        )
                      }
                      onSelect={() => {

                      setEmployeeId(
                        item.id.toString()
                      );

                    setOpen(false);

                  }}
                    >

                      {getEmployeeName(
  item
)}

                    </CommandItem>

                  )
                )}

              </CommandGroup>

            </Command>

          </PopoverContent>

        </Popover>

      </div>

      {/* Категория */}
      <div className="space-y-2">

        <label className="text-sm font-medium">
          {t.category}
        </label>

        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
          className="w-full h-12 rounded-xl border px-4 bg-white"
        >

          <option value="">
  {t.selectCategory}
</option>

{categories.map(
  (item) => (

    <option
      key={item.db}
      value={item.db}
    >
      {item.text}
    </option>

  )
)}

        </select>

      </div>

      {/* Описание */}
      <div className="space-y-2">

        <label className="text-sm font-medium">
          {t.improvementDescription}
        </label>

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          className="w-full rounded-xl border px-4 py-3 min-h-[160px] resize-none"
          placeholder={t.describeImprovement}
        />

      </div>

      <Button
        onClick={handleSubmit}
        className="w-full h-12 rounded-xl text-base"
      >
        {t.submitImprovementButton}
      </Button>

    </Card>
  );
}