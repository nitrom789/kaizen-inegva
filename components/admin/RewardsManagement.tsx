"use client";

import { useEffect, useState } from "react";

import * as XLSX from "xlsx";

import { saveAs } from "file-saver";

import { supabase } from "@/lib/supabase";

type Employee = {
  id: number;
  full_name: string;
  pin_code: string;
  site_id: number;
};

type RewardTotal = {
  employee_id: number;
  total: number;
};

export function RewardsManagement() {

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [totals, setTotals] =
    useState<RewardTotal[]>([]);

  const [selectedEmployee,
    setSelectedEmployee] =
    useState("");

  const [points, setPoints] =
    useState("");

  const [comment, setComment] =
    useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    const {
      data: employeesData,
    } = await supabase
      .from("employees")
      .select("*")
      .order("full_name");

    if (!employeesData) {
      return;
    }

    setEmployees(employeesData);

    const employeeIds =
      employeesData.map(
        (item) => item.id
      );

    const {
      data: rewardsData,
    } = await supabase
      .from("reward_transactions")
      .select("*")
      .in(
        "employee_id",
        employeeIds.map(String)
      );

    const totalsMap: Record<
      number,
      number
    > = {};

    rewardsData?.forEach((item) => {

      if (!totalsMap[item.employee_id]) {
        totalsMap[item.employee_id] = 0;
      }

      totalsMap[item.employee_id] +=
        Number(item.points);
    });

    const totalsArray =
      employeeIds.map((id) => ({
        employee_id: id,
        total: totalsMap[id] || 0,
      }));

    setTotals(totalsArray);
  };

  const handleSpend = async () => {

    if (
      !selectedEmployee ||
      !points ||
      !comment
    ) {
      alert("Заполните все поля");
      return;
    }

    const {
      error,
    } = await supabase
      .from("reward_transactions")
      .insert([
        {
          employee_id:
            Number(selectedEmployee),

          points:
            -Math.abs(
              Number(points)
            ),

          type: "spend",

          comment,
        },
      ]);

    if (error) {
      console.error(error);
      return;
    }

    setSelectedEmployee("");
    setPoints("");
    setComment("");

    fetchData();
  };

  const exportPins = (
    siteId: number,
    siteName: string
  ) => {

    const filteredEmployees =
      employees.filter(
        (item) =>
          item.site_id === siteId
      );

    const exportData =
      filteredEmployees.map(
        (item) => ({
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

  return (
    <div className="space-y-6">

     

      <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">

        <h2 className="text-2xl font-bold">

          Списание баллов

        </h2>

        <select
          value={selectedEmployee}
          onChange={(e) =>
            setSelectedEmployee(
              e.target.value
            )
          }
          className="w-full h-12 rounded-xl border px-4"
        >

          <option value="">
            Выберите сотрудника
          </option>

          {employees.map((item) => (

            <option
              key={item.id}
              value={item.id}
            >

              {item.full_name}

            </option>

          ))}

        </select>

        <input
          type="number"
          placeholder="Количество баллов"
          value={points}
          onChange={(e) =>
            setPoints(
              e.target.value
            )
          }
          className="w-full h-12 rounded-xl border px-4"
        />

        <textarea
          placeholder="Комментарий"
          value={comment}
          onChange={(e) =>
            setComment(
              e.target.value
            )
          }
          className="w-full rounded-xl border px-4 py-3 min-h-[120px]"
        />

        <button
          onClick={handleSpend}
          className="w-full h-12 rounded-xl bg-red-600 text-white font-medium"
        >

          Списать баллы

        </button>

      </div>

      <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">

        <h2 className="text-2xl font-bold">

          Балансы сотрудников

        </h2>

        {totals.map((item) => {

          const employee =
            employees.find(
              (emp) =>
                emp.id ===
                item.employee_id
            );

          return (

            <div
              key={item.employee_id}
              className="flex items-center justify-between border-b pb-3"
            >

              <span className="font-medium">

                {employee?.full_name}

              </span>

              <span className="font-bold text-blue-600">

                {item.total}

              </span>

            </div>
          );
        })}

      </div>

    </div>
  );
}