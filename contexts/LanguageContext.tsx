"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { translations } from "@/lib/translations";

type Language =
  | "ru"
  | "ua"
  | "en";

type ContextType = {
  language: Language;

  setLanguage: (
    language: Language
  ) => void;

  t: Record<
    string,
    string
  >;
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
      setLanguage(savedLanguage);
    }

  }, []);

  useEffect(() => {

    localStorage.setItem(
      "language",
      language
    );

  }, [language]);

const value: ContextType = {
  language,

  setLanguage,

  t: translations[
    language
  ] || translations.ru,
};

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