"use client";

import { useEffect, useState } from "react";

import { translations } from "@/lib/translations";

export function useTranslation() {

  const getLanguage = () =>
    localStorage.getItem("language") ||
    "ru";

  const [language, setLanguage] =
    useState(getLanguage);

  useEffect(() => {

    const handleLanguageChange =
      () => {

        setLanguage(
          getLanguage()
        );
      };

    window.addEventListener(
      "languageChanged",
      handleLanguageChange
    );

    return () => {

      window.removeEventListener(
        "languageChanged",
        handleLanguageChange
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