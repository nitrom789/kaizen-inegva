import Link from "next/link";

import { Header } from "@/components/layout/Header";

export default function Home() {

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-600 to-white flex flex-col">

      <Header />

      <section className="flex-1 flex items-center justify-center px-4 pb-10">

        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 text-center space-y-8">

          <div className="space-y-3">

            <h1 className="text-4xl font-bold text-gray-900">

              Kaizen Inegva

            </h1>

            <p className="text-gray-500 text-lg">

              Выберите производственную площадку

            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Link
              href="/argo"
              className="h-28 rounded-3xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-xl hover:scale-[1.02] transition"
            >

              Арго

            </Link>

            <Link
              href="/bukovaya"
              className="h-28 rounded-3xl bg-green-600 text-white flex items-center justify-center text-2xl font-bold shadow-xl hover:scale-[1.02] transition"
            >

              Буковая

            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}