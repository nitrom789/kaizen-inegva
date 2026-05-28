"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type ContextType = {
  language: string;

  setLanguage: React.Dispatch<
    React.SetStateAction<string>
  >;
};

const LanguageContext =
  createContext<ContextType | null>(
    null
  );

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

  const context =
    useContext(
      LanguageContext
    );

  if (!context) {

  return {
    language: "ru",
    setLanguage: () => {},
  };
}

  return context;
}