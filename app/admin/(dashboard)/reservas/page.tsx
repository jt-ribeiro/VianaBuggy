import { createClient } from "@/lib/supabase/server";
import { ReservationsTable } from "../../components/ReservationsTable";

export const revalidate = 0;

export default async function AdminReservas() {
  const supabase = await createClient();

  const { data: reservations, error } = await supabase
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-heading text-brand-white uppercase mb-4">Reservas</h1>
        <div className="bg-red-500/10 text-red-500 border border-red-500 p-4 rounded">
          Erro ao carregar reservas: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading text-brand-white uppercase mb-2">Reservas</h1>
        <p className="text-brand-gray-text">Gestão de todas as reservas recebidas.</p>
      </div>

      <ReservationsTable data={reservations || []} />
    </div>
  );
}
