"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { RejectDialog } from "@/components/dialogs/RejectDialog";
import { DeleteDialog } from "@/components/dialogs/DeleteDialog";

import { Header } from "@/components/layout/Header";

import { supabase } from "@/lib/supabase";

import { AdminStats } from "@/components/admin/AdminStats";
import { EmployeeForm } from "@/components/admin/EmployeeForm";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

type Improvement = {
  id: number;
  category: string;
  description: string;
  status: string;
  reject_reason?: string;
  employee_id: number;

  employees?: {
    full_name: string;
    photo_url: string;
  };
};

export default function AdminPage() {

  const [improvements, setImprovements] =
    useState<Improvement[]>([]);

  const [rejectOpen, setRejectOpen] =
    useState(false);

  const [selectedImprovementId,
    setSelectedImprovementId] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [selectedDeleteId,
    setSelectedDeleteId] =
    useState<number | null>(null);

  const [activeSection, setActiveSection] =
    useState("overview");

  const [mobileOpen, setMobileOpen] =
    useState(false);

  useEffect(() => {

    checkAdmin();

    const handleOpenMenu = () => {
      setMobileOpen(true);
    };

    window.addEventListener(
      "open-admin-mobile-menu",
      handleOpenMenu
    );

    return () => {

      window.removeEventListener(
        "open-admin-mobile-menu",
        handleOpenMenu
      );
    };

  }, []);

  const checkAdmin = async () => {

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.email) {
      window.location.href = "/login";
      return;
    }

    const userEmail = session.user.email;

    const { data: adminData, error } =
      await supabase
        .from("admins")
        .select("*")
        .eq("email", userEmail)
        .single();

    if (error || !adminData) {
      window.location.href = "/";
      return;
    }

    fetchImprovements();
  };

  const fetchImprovements = async () => {

    const { data, error } = await supabase
      .from("improvements")
      .select(`
        *,
        employees (
          full_name,
          photo_url
        )
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      return;
    }

    setImprovements(data || []);
    setLoading(false);
  };

  const updateStatus = async (
    id: number,
    status: string,
    rejectReason = ""
  ) => {

    const currentImprovement =
      improvements.find(
        (item) => item.id === id
      );

    const { error } = await supabase
      .from("improvements")
      .update({
        status,
        reject_reason: rejectReason,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    if (
      status === "Внедрено" &&
      currentImprovement
    ) {

      const {
        data: existingReward,
      } = await supabase
        .from("reward_transactions")
        .select("id")
        .eq(
          "improvement_id",
          currentImprovement.id
        )
        .eq("type", "reward")
        .maybeSingle();

      if (!existingReward) {

        const {
          error: rewardError,
        } = await supabase
          .from("reward_transactions")
          .insert([
            {
              employee_id:
                currentImprovement.employee_id,

              improvement_id:
                currentImprovement.id,

              points: 200,

              type: "reward",

              comment:
                "Внедренное улучшение",
            },
          ]);

        if (rewardError) {
          console.error(rewardError);
        }
      }
    }

    fetchImprovements();
  };

  const deleteImprovement = async (
    id: number
  ) => {

    const { error } = await supabase
      .from("improvements")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setImprovements((prev) =>
      prev.filter((item) => item.id !== id)
    );

    setDeleteOpen(false);
  };

  const newItems = improvements.filter(
    (item) => item.status === "Новая"
  );

  const inProgressItems = improvements.filter(
    (item) => item.status === "В работе"
  );

  const implementedItems = improvements.filter(
    (item) => item.status === "Внедрено"
  );

  const rejectedItems = improvements.filter(
    (item) => item.status === "Отклонено"
  );

  const renderCards = (
    items: Improvement[]
  ) => {

    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {items.map((item) => (

          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 shadow-xl space-y-4"
          >

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">

                  {item.employees?.photo_url ? (

                    <Image
                      src={item.employees.photo_url}
                      alt={item.employees.full_name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-gray-600">

                      {item.employees?.full_name?.[0]}

                    </div>

                  )}

                </div>

                <div>

                  <h2 className="font-semibold text-lg">
                    {item.employees?.full_name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {item.category}
                  </p>

                </div>

              </div>

              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                {item.status}
              </span>

            </div>

            <p className="text-gray-700">
              {item.description}
            </p>

            {item.reject_reason && (

              <div className="bg-red-50 border border-red-100 rounded-xl p-3">

                <p className="text-sm font-medium text-red-700">
                  Причина отклонения
                </p>

                <p className="text-sm text-red-600 mt-1">
                  {item.reject_reason}
                </p>

              </div>

            )}

            <div className="flex flex-wrap gap-2">

              <button
                onClick={() =>
                  updateStatus(item.id, "Новая")
                }
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm"
              >
                Новая
              </button>

              <button
                onClick={() =>
                  updateStatus(item.id, "В работе")
                }
                className="bg-yellow-500 text-white px-4 py-2 rounded-xl text-sm"
              >
                В работу
              </button>

              <button
                onClick={() =>
                  updateStatus(item.id, "Внедрено")
                }
                className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm"
              >
                Внедрено
              </button>

              <button
                onClick={() => {
                  setSelectedImprovementId(item.id);
                  setRejectOpen(true);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm"
              >
                Отклонить
              </button>

              <button
                onClick={() => {
                  setSelectedDeleteId(item.id);
                  setDeleteOpen(true);
                }}
                className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm"
              >
                Удалить
              </button>

            </div>

          </div>

        ))}

      </div>
    );
  };

  if (loading) {

    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-600 to-white flex items-center justify-center">

        <p className="text-white text-lg">
          Загрузка...
        </p>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-600 to-white">

      <Header />

      <section className="p-4">

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          <AdminSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />

          <div className="flex-1 space-y-8">

            {activeSection === "overview" && (

              <>

                <h1 className="text-3xl font-bold text-white">
                  Обзор системы
                </h1>

                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">

                  <AdminStats
                    title="Новые"
                    value={newItems.length}
                  />

                  <AdminStats
                    title="В работе"
                    value={inProgressItems.length}
                  />

                  <AdminStats
                    title="Внедрено"
                    value={implementedItems.length}
                  />

                  <AdminStats
                    title="Отклонено"
                    value={rejectedItems.length}
                  />

                </div>

              </>

            )}

            {activeSection === "employees" && (
              <EmployeeForm />
            )}

            {activeSection === "improvements" && (

              <div className="space-y-8">

                <div className="space-y-3">

                  <h2 className="text-xl font-semibold text-white">
                    Новые
                  </h2>

                  {renderCards(newItems)}

                </div>

                <div className="space-y-3">

                  <h2 className="text-xl font-semibold text-white">
                    В работе
                  </h2>

                  {renderCards(inProgressItems)}

                </div>

                <div className="space-y-3">

                  <h2 className="text-xl font-semibold text-white">
                    Внедрено
                  </h2>

                  {renderCards(implementedItems)}

                </div>

                <div className="space-y-3">

                  <h2 className="text-xl font-semibold text-white">
                    Отклонено
                  </h2>

                  {renderCards(rejectedItems)}

                </div>

              </div>

            )}

          </div>

        </div>

      </section>

      <RejectDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        onConfirm={(reason) => {

          if (!selectedImprovementId) {
            return;
          }

          updateStatus(
            selectedImprovementId,
            "Отклонено",
            reason
          );
        }}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => {

          if (!selectedDeleteId) {
            return;
          }

          deleteImprovement(selectedDeleteId);
        }}
      />

    </main>
  );
}