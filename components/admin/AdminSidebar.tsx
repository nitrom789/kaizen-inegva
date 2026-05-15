"use client";

import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Settings,
} from "lucide-react";

type AdminSidebarProps = {
  activeSection: string;
  setActiveSection: (value: string) => void;
};

export function AdminSidebar({
  activeSection,
  setActiveSection,
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
  ];

  return (
    <aside className="w-full lg:w-[260px] bg-white rounded-3xl shadow-lg border border-white/40 overflow-hidden h-fit">

      <div className="px-5 pt-5 pb-4 border-b border-gray-100">

        <h2 className="text-lg font-bold text-gray-900">
          Администрирование
        </h2>

      </div>

      <div className="p-3 space-y-1">

        {items.map((item) => {

          const Icon = item.icon;

          return (

            <button
              key={item.key}
              onClick={() =>
                setActiveSection(item.key)
              }
              className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
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

              <span className="font-medium text-[15px]">
                {item.label}
              </span>

            </button>

          );
        })}

      </div>

      <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">

        <span className="text-xs text-gray-400">
          v1.0.0
        </span>

        <button className="text-gray-400 hover:text-gray-600 transition">

          <Settings size={16} />

        </button>

      </div>

    </aside>
  );
}