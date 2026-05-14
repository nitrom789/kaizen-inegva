"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Неверный логин или пароль");
      return;
    }

    router.push("/admin");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-600 to-white flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-5">

        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Вход администратора
          </h1>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-12 border rounded-xl px-4"
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-12 border rounded-xl px-4"
        />

        <button
          onClick={handleLogin}
          className="w-full h-12 bg-blue-600 text-white rounded-xl"
        >
          Войти
        </button>

      </div>

    </main>
  );
}