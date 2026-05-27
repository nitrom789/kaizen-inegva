"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
} from "next/navigation";

import { supabase } from "@/lib/supabase";

import { useLanguage } from "@/contexts/LanguageContext";

export function Header() {

  const pathname = usePathname();

  const {
    t,
    language,
    setLanguage,
  } = useLanguage();

  const [userEmail, setUserEmail] =
    useState("");

  const [mobileMenuOpen,
    setMobileMenuOpen] =
    useState(false);

  const isAdminPage =
    pathname.startsWith("/admin");

  const isArgo =
    pathname.startsWith("/argo");

  const isBukovaya =
    pathname.startsWith("/bukovaya");

  const basePath = isArgo
    ? "/argo"
    : isBukovaya
    ? "/bukovaya"
    : "";

  const isHomePage =
    pathname === "/";

  const navItems = isHomePage
    ? []
    : isAdminPage
    ? [
        {
          label: "Главная",
          href: "/",
        },
      ]
    : [
        {
          label: "Главная",
          href: basePath || "/",
        },
        {
          label: "Новая",
          href: `${basePath}/new`,
        },
        {
          label: "В работе",
          href: `${basePath}/in-progress`,
        },
        {
          label: "Внедрено",
          href: `${basePath}/implemented`,
        },
        {
          label: "Отклонено",
          href: `${basePath}/rejected`,
        },
        {
          label: "Таблица баллов",
          href: `${basePath}/points`,
        },
      ];

  const checkUser = async () => {

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user?.email) {

      setUserEmail(
        session.user.email
      );
    }
  };

  useEffect(() => {

    checkUser();

  }, []);

  const handleLogout = async () => {

    await supabase.auth.signOut();

    window.location.href = "/";
  };

  return (
    <header className="w-full px-4 pt-4">

      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl px-6 py-4">

        <div className="flex items-center justify-between gap-4">

          {isAdminPage && (

            <button
              onClick={() => {

                const event =
                  new CustomEvent(
                    "open-admin-mobile-menu"
                  );

                window.dispatchEvent(
                  event
                );
              }}
              className="lg:hidden text-white border border-white/30 px-4 py-2 rounded-xl text-sm"
            >

              Меню

            </button>

          )}

          <div className="hidden md:flex items-center gap-2">

            {navItems.map((item) => (

              <Link
                key={item.href}
                href={item.href}
                className={`px-5 py-3 rounded-2xl whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? "bg-white text-blue-600 shadow-lg"
                    : "text-white hover:bg-white/10"
                }`}
              >

                {item.label}

              </Link>

            ))}

            {!isAdminPage && userEmail && (

              <Link
                href="/admin"
                className={`px-5 py-3 rounded-2xl whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                  pathname === "/admin"
                    ? "bg-white text-blue-600 shadow-lg"
                    : "text-white hover:bg-white/10"
                }`}
              >

                Администрирование

              </Link>

            )}

          </div>

          {!isAdminPage && (

            <div className="md:hidden">

              <button
                onClick={() =>
                  setMobileMenuOpen(
                    !mobileMenuOpen
                  )
                }
                className="text-white border border-white/30 px-4 py-2 rounded-xl text-sm"
              >

                Меню

              </button>

            </div>

          )}

          {!userEmail ? (

            <div className="flex items-center gap-4">

              <div className="hidden md:flex items-center gap-1 border border-white/20 rounded-xl p-1">

                <button
                  onClick={() =>
                    setLanguage("ru")
                  }
                  className={`px-2 py-1 rounded-lg text-xs transition ${
                    language === "ru"
                      ? "bg-white text-blue-600"
                      : "text-white"
                  }`}
                >

                  RU

                </button>

                <button
                  onClick={() =>
                    setLanguage("ua")
                  }
                  className={`px-2 py-1 rounded-lg text-xs transition ${
                    language === "ua"
                      ? "bg-white text-blue-600"
                      : "text-white"
                  }`}
                >

                  UA

                </button>

                <button
                  onClick={() =>
                    setLanguage("en")
                  }
                  className={`px-2 py-1 rounded-lg text-xs transition ${
                    language === "en"
                      ? "bg-white text-blue-600"
                      : "text-white"
                  }`}
                >

                  EN

                </button>

              </div>

              <Link
                href="/login"
                className="text-white border border-white/30 px-5 py-3 rounded-2xl text-sm whitespace-nowrap hover:bg-white/10 transition"
              >

                {t.login}

              </Link>

            </div>

          ) : (

            <div className="flex items-center gap-4">

              <div className="hidden md:flex items-center gap-1 border border-white/20 rounded-xl p-1">

                <button
                  onClick={() =>
                    setLanguage("ru")
                  }
                  className={`px-2 py-1 rounded-lg text-xs transition ${
                    language === "ru"
                      ? "bg-white text-blue-600"
                      : "text-white"
                  }`}
                >

                  RU

                </button>

                <button
                  onClick={() =>
                    setLanguage("ua")
                  }
                  className={`px-2 py-1 rounded-lg text-xs transition ${
                    language === "ua"
                      ? "bg-white text-blue-600"
                      : "text-white"
                  }`}
                >

                  UA

                </button>

                <button
                  onClick={() =>
                    setLanguage("en")
                  }
                  className={`px-2 py-1 rounded-lg text-xs transition ${
                    language === "en"
                      ? "bg-white text-blue-600"
                      : "text-white"
                  }`}
                >

                  EN

                </button>

              </div>

              <div className="text-right hidden sm:block">

                <p className="text-white text-sm font-semibold">

                  {userEmail}

                </p>

              </div>

              <button
                onClick={handleLogout}
                className="text-white border border-white/30 px-5 py-3 rounded-2xl text-sm hover:bg-white/10 transition"
              >

                {t.logout}

              </button>

            </div>

          )}

        </div>

        {mobileMenuOpen && (

          <div className="md:hidden flex flex-col gap-2 pt-4">

            {navItems.map((item) => (

              <Link
                key={item.href}
                href={item.href}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className={`px-4 py-3 rounded-xl text-sm font-medium transition ${
                  pathname === item.href
                    ? "bg-white text-blue-600"
                    : "text-white hover:bg-white/10"
                }`}
              >

                {item.label}

              </Link>

            ))}

            {!isAdminPage && userEmail && (

              <Link
                href="/admin"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className={`px-4 py-3 rounded-xl text-sm font-medium transition ${
                  pathname === "/admin"
                    ? "bg-white text-blue-600"
                    : "text-white hover:bg-white/10"
                }`}
              >

                Администрирование

              </Link>

            )}

          </div>

        )}

      </div>

    </header>
  );
}