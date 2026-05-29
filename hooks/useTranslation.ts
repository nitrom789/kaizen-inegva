"use client";

import { useEffect, useState } from "react";

import { translations } from "@/lib/translations";

export function useTranslation() {

  const [language, setLanguage] =
    useState("ru");

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

    updateLanguage();

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

  const t =
    translations[
      language as keyof typeof translations
    ];

  return {
    language,
    t,
  };
}