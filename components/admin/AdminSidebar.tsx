"use client";

import Link from "next/link";

import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Settings,
  Home,
  X,
} from "lucide-react";

type AdminSidebarProps = {
  activeSection: string;
  setActiveSection: (value: string) => void;

  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
};

export function AdminSidebar({
  activeSection,
  setActiveSection,
  mobileOpen,
  setMobileOpen,
}: AdminSidebarProps) {

  const items = [
    {
      key: "overview",
      label: "Обзор",
      icon: LayoutDashboard,
    },
    {
      key: "improvements",
      label: "Предложения",
      icon: ClipboardList,
    },
    {
      key: "employees",
      label: "Сотрудники",
      icon: Users,
    },
    {
      key: "rewards",
      label: "Баллы",
      icon: Settings,
},
  ];

  return (
    <>

      {mobileOpen && (

        <div
          onClick={() =>
            setMobileOpen(false)
          }
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />

      )}

      <aside
        className={`fixed lg:static top-0 left-0 min-h-screen lg:h-fit w-[290px] bg-white shadow-2xl border-r border-gray-100 z-50 transition-transform duration-300 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >

        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">

          <h2 className="text-lg font-bold text-gray-900">
            Администрирование
          </h2>

          <button
            onClick={() =>
              setMobileOpen(false)
            }
            className="lg:hidden text-gray-500"
          >
            <X size={20} />
          </button>

        </div>

        <div className="p-3 space-y-1">

          <Link
            href="/"
            className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-gray-700 hover:bg-gray-50"
          >

            <Home
              size={18}
              className="text-gray-400 group-hover:text-gray-600"
            />

            <span className="font-medium text-sm">
              Главная
            </span>

          </Link>

          {items.map((item) => {

            const Icon = item.icon;

            return (

              <button
                key={item.key}
                onClick={() => {

                  setActiveSection(item.key);

                  setMobileOpen(false);
                }}
                className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 ${
                  activeSection === item.key
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >

                {activeSection === item.key && (

                  <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-600" />

                )}

                <Icon
                  size={18}
                  className={`transition ${
                    activeSection === item.key
                      ? "text-blue-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />

                <span className="font-medium text-sm">
                  {item.label}
                </span>

              </button>

            );
          })}

        </div>

        <div className="absolute bottom-0 left-0 right-0 px-5 py-4 border-t border-gray-100 flex items-center justify-between bg-white">

          <span className="text-xs text-gray-400">
            v1.0.0
          </span>

          <button className="text-gray-400 hover:text-gray-600 transition">

            <Settings size={16} />

          </button>

        </div>

      </aside>

    </>
  );
}