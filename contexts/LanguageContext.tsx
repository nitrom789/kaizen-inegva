"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type ContextType = {
  language: string;

  setLanguage: (
    language: string
  ) => void;
};

const LanguageContext =
  createContext<ContextType>({
    language: "ru",

    setLanguage: () => {},
  });

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {

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

  useEffect(() => {

    localStorage.setItem(
      "language",
      language
    );

  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
      }}
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