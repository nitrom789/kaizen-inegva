"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

type Employee = {
  id: number;
  full_name: string;
  pin_code: string;
};

type Transaction = {
  id: number;
  points: number;
  type: string;
  comment: string;
  created_at: string;
};

export default function EmployeePointsPage({
  params,
}: {
  params: {
    pin: string;
    site: string;
  };
}) {

  const [employee, setEmployee] =
    useState<Employee | null>(null);

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [totalPoints, setTotalPoints] =
    useState(0);

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {

    const { data: employeeData } =
      await supabase
        .from("employees")
        .select("*")
        .eq(
          "pin_code",
          params.pin
        )
        .single();

    if (!employeeData) {
      return;
    }

    setEmployee(employeeData);

    const {
      data: rewardsData,
    } = await supabase
      .from("reward_transactions")
      .select("*")
      .eq(
        "employee_id",
        employeeData.id
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (!rewardsData) {
      return;
    }

    setTransactions(rewardsData);

    let total = 0;

    rewardsData.forEach((item) => {
      total += item.points;
    });

    setTotalPoints(total);
  };

  if (!employee) {

    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-600 to-white flex items-center justify-center">

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <p className="text-lg font-medium">

            Сотрудник не найден

          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-600 to-white p-4">

      <div className="max-w-3xl mx-auto space-y-6">

        <div className="bg-white rounded-3xl shadow-xl p-6">

          <h1 className="text-3xl font-bold">

            {employee.full_name}

          </h1>

          <p className="text-gray-500 mt-2">

            Личный кабинет сотрудника

          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6">

          <p className="text-gray-500">

            Текущий баланс

          </p>

          <h2 className="text-5xl font-bold text-blue-600 mt-2">

            {totalPoints}

          </h2>

        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">

          <h2 className="text-2xl font-semibold">

            История операций

          </h2>

          {transactions.map((item) => (

            <div
              key={item.id}
              className="border-b pb-3 flex items-center justify-between"
            >

              <div>

                <p className="font-medium">

                  {item.comment}

                </p>

                <p className="text-sm text-gray-500">

                  {new Date(
                    item.created_at
                  ).toLocaleDateString()}

                </p>

              </div>

              <div
                className={`font-bold text-lg ${
                  item.points >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >

                {item.points > 0
                  ? "+"
                  : ""}

                {item.points}

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}