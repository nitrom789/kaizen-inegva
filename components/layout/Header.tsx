"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Главная",
      href: "/",
    },
    {
      label: "Новая",
      href: "/new",
    },
    {
      label: "В работе",
      href: "/in-progress",
    },
    {
      label: "Внедрено",
      href: "/implemented",
    },
    {
      label: "Отклонено",
      href: "/rejected",
    },
  ];

  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user?.email) {
      setUserEmail(session.user.email);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="w-full px-4 pt-4">

      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 flex items-center justify-between gap-4">

        <div className="flex gap-2 overflow-x-auto">

          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition ${
                pathname === item.href
                  ? "bg-white text-blue-600"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {userEmail && (
            <Link
              href="/admin"
              className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition ${
                pathname === "/admin"
                  ? "bg-white text-blue-600"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Администрирование
            </Link>
          )}

        </div>

        {!userEmail ? (
          <Link
            href="/login"
            className="text-white border border-white/30 px-4 py-2 rounded-xl text-sm whitespace-nowrap hover:bg-white/10 transition"
          >
            Войти
          </Link>
        ) : (
          <div className="flex items-center gap-3">

            <div className="text-right hidden sm:block">
              <p className="text-white text-sm font-medium">
                {userEmail}
              </p>

              <p className="text-white/70 text-xs">
                Администратор
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="text-white border border-white/30 px-4 py-2 rounded-xl text-sm hover:bg-white/10 transition"
            >
              Выйти
            </button>

          </div>
        )}

      </div>

    </header>
  );
}