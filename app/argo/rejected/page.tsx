import { Header } from "@/components/layout/Header";
import { ImprovementCard } from "@/components/cards/ImprovementCard";
import { supabase } from "@/lib/supabase";

export default async function ArgoInProgressPage() {

  const { data: improvements, error } =
    await supabase
      .from("improvements")
      .select(`
        *,
        employees (
          full_name,
          photo_url
        )
      `)
      .eq("status", "Отклонено")
      .eq("site_id", 1)
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    console.error(error);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-600 to-white">

      <Header />

      <section className="p-4 pt-6">

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {improvements?.map((item) => (

            <ImprovementCard
              key={item.id}
              photoUrl={item.employees?.photo_url}
              title={item.category}
              category={item.category}
              employee={item.employees?.full_name}
              description={item.description}
            />

          ))}

        </div>

      </section>

    </main>
  );
}