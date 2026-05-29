"use client";

import { useEffect, useState } from "react";

import { translations } from "@/lib/translations";

export function useTranslation() {

  const [language, setLanguage] =
    useState(() => {

      if (
        typeof window ===
        "undefined"
      ) {
        return "ru";
      }

      return (
        localStorage.getItem(
          "language"
        ) || "ru"
      );
    });

  useEffect(() => {

    const updateLanguage =
      () => {

        const savedLanguage =
          localStorage.getItem(
            "language"
          ) || "ru";

        setLanguage(
          savedLanguage
        );
      };

    window.addEventListener(
      "languageChanged",
      updateLanguage
    );

    return () => {

      window.removeEventListener(
        "languageChanged",
        updateLanguage
      );
    };

  }, []);

  const changeLanguage = (
    newLanguage: string
  ) => {

    localStorage.setItem(
      "language",
      newLanguage
    );

    setLanguage(
      newLanguage
    );

    window.dispatchEvent(
      new Event(
        "languageChanged"
      )
    );
  };

  const t =
    translations[
      language as keyof typeof translations
    ];

  return {
    language,
    setLanguage:
      changeLanguage,
    t,
  };
}