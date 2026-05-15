"use client";

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
    },
    {
      key: "improvements",
      label: "Предложения",
    },
    {
      key: "employees",
      label: "Сотрудники",
    },
  ];

  return (
    <aside className="w-full lg:w-72 bg-white rounded-2xl shadow-xl p-4 space-y-2 h-fit">

      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Администрирование
      </h2>

      {items.map((item) => (

        <button
          key={item.key}
          onClick={() => setActiveSection(item.key)}
          className={`w-full text-left px-4 py-3 rounded-xl transition font-medium ${
            activeSection === item.key
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          {item.label}
        </button>

      ))}

    </aside>
  );
}