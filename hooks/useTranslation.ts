"use client";

import { useEffect, useState } from "react";

import { translations } from "@/lib/translations";

export function useTranslation() {

  const [language, setLanguage] =
    useState("ru");

  useEffect(() => {

    const savedLanguage =
      localStorage.getItem(
        "language"
      );

    if (savedLanguage) {

      setLanguage(
        savedLanguage
      );
    }

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