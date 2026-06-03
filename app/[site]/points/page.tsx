"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/hooks/useTranslation";

type Employee = {
  id: number;
  full_name_ru: string;
  full_name_ua: string;
  full_name_en: string;
  pin_code: string;
};

type LeaderboardItem = {
  employee_id: number;
  total: number;
};

type RewardTransaction = {
  employee_id: number;
  points: number;
};

export default function PointsPage() {

  const params = useParams();

  const site =
    params.site as string;

  const {
    language,
    t,
  } = useTranslation();

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [leaderboard, setLeaderboard] =
    useState<LeaderboardItem[]>([]);

  const [pinCode, setPinCode] =
    useState("");

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const getEmployeeName = (
    employee: Employee
  ) => {

    if (language === "ua") {
      return employee.full_name_ua;
    }

    if (language === "en") {
      return employee.full_name_en;
    }

    return employee.full_name_ru;
  };

  const fetchLeaderboard = async () => {

    const { data: employeesData } =
      await supabase
        .from("employees")
        .select("*")
        .eq(
          "site_id",
          site === "argo"
            ? 1
            : 2
        );

    if (!employeesData) {
      return;
    }

    setEmployees(
      employeesData as Employee[]
    );

    const employeeIds =
      employeesData.map(
        (item) => item.id
      );

    if (employeeIds.length === 0) {
      setLeaderboard([]);
      return;
    }

    const {
      data: rewardsData,
    } = await supabase
      .from("reward_transactions")
      .select("*")
      .in(
        "employee_id",
        employeeIds.map(String)
      );

    const totals: Record<
      number,
      number
    > = {};

    (rewardsData as RewardTransaction[] | null)
      ?.forEach((item) => {

        if (!totals[item.employee_id]) {
          totals[item.employee_id] = 0;
        }

        totals[item.employee_id] +=
          Number(item.points);
      });

    const leaderboardData =
      employeeIds.map((id) => ({
        employee_id: id,
        total: totals[id] || 0,
      }));

    leaderboardData.sort(
      (a, b) => b.total - a.total
    );

    setLeaderboard(
      leaderboardData
    );
  };

  const handleOpenCabinet = () => {

    const employee =
      employees.find(
        (item) =>
          String(item.pin_code).trim() ===
          pinCode.trim()
      );

    if (!employee) {
      alert("Неверный PIN");
      return;
    }

    window.location.href =
      `/${site}/points/${pinCode}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-600 to-white p-4">

      <Header />

      <div className="max-w-3xl mx-auto space-y-6">

        <div className="bg-white rounded-3xl shadow-xl p-6">

          <h1 className="text-3xl font-bold mb-2">
            {t.pointsTable}
          </h1>

          <p className="text-gray-500">

            {t.siteLabel}:{" "}

            {site === "argo"
              ? t.siteArgo
              : t.siteBukovaya}

          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">

          <h2 className="text-xl font-semibold">
            {t.personalAccount}
          </h2>

          <input
            type="password"
            placeholder={t.enterPin}
            value={pinCode}
            onChange={(e) =>
              setPinCode(
                e.target.value
              )
            }
            className="w-full h-12 rounded-xl border px-4"
          />

          <button
            onClick={
              handleOpenCabinet
            }
            className="w-full h-12 rounded-xl bg-blue-600 text-white font-medium"
          >

            {t.openAccount}

          </button>

        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">

          {leaderboard.map((item) => {

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

                  {employee
                    ? getEmployeeName(
                        employee
                      )
                    : ""}

                </span>

                <span className="font-bold text-blue-600">

                  {item.total}

                </span>

              </div>

            );
          })}

        </div>

      </div>

    </main>
  );
}