"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { translations } from "@/lib/translations";

type Language =
  | "ru"
  | "ua"
  | "en";

type Translation =
  Record<string, string>;

type ContextType = {
  language: Language;

  setLanguage: (
    language: Language
  ) => void;

  t: Translation;
};

const LanguageContext =
  createContext<ContextType>({
    language: "ru",

    setLanguage: () => {},

    t: translations.ru,
  });

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [language, setLanguage] =
    useState<Language>("ru");

  useEffect(() => {

    const savedLanguage =
      localStorage.getItem(
        "language"
      ) as Language | null;

    if (savedLanguage) {

      setLanguage(
        savedLanguage
      );
    }

  }, []);

  useEffect(() => {

    localStorage.setItem(
      "language",
      language
    );

  }, [language]);

  const t = useMemo(() => {

    return (
      translations[language] ||
      translations.ru
    );

  }, [language]);

  const value = useMemo(() => {

    return {
      language,

      setLanguage,

      t,
    };

  }, [language, t]);

  return (
    <LanguageContext.Provider
      value={value}
    >

      {children}

    </LanguageContext.Provider>
  );
}

export function useLanguage() {

  return useContext(
    LanguageContext
  );
}