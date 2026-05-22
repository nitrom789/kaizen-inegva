"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
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

export default function EmployeePointsPage() {

  const params = useParams();

  const pin =
    String(params.pin);

  const site =
    String(params.site);

  const [employee, setEmployee] =
    useState<Employee | null>(null);

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [totalPoints, setTotalPoints] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

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
          pin.trim()
        )
        .single();

    if (!employeeData) {
      setLoading(false);
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

    setTransactions(
      rewardsData || []
    );

    let total = 0;

    rewardsData?.forEach((item) => {

      total += Number(item.points);

    });

    setTotalPoints(total);

    setLoading(false);
  };

  if (loading) {

    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-600 to-white flex items-center justify-center">
        <Header />
        <p className="text-white text-lg">
          Загрузка...
        </p>

      </main>
    );
  }

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

        <button
          onClick={() => {
            window.location.href =
              `/${site}/points`;
          }}
          className="w-full h-12 rounded-xl bg-gray-900 text-white font-medium"
        >

          Назад к таблице

        </button>

        <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">

          <h2 className="text-2xl font-semibold">

            История операций

          </h2>

          {transactions.length === 0 && (

            <p className="text-gray-500">

              Операций пока нет

            </p>

          )}

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