import { Header } from "@/components/layout/Header";
import { KaizenForm } from "@/components/forms/KaizenForm";

export default function BukovayaPage() {

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-600 to-white flex flex-col">

      <Header />

      <section className="flex-1 flex items-center justify-center px-4 pb-10">

        <KaizenForm siteId={2} />

      </section>

    </main>
  );
}