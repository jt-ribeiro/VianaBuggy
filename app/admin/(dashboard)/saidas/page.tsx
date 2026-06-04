import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { CarFront, Users } from "lucide-react";
import { getTourById } from "@/lib/tours";

export const revalidate = 0;

export default async function AdminSaidas() {
  const supabase = await createClient();

  const { data: reservations, error } = await supabase
    .from("reservations")
    .select("*")
    .in("status", ["confirmed", "completed", "pending"])
    .order("slot_date", { ascending: true })
    .order("slot_time", { ascending: true });

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-heading text-brand-white uppercase mb-4">Saídas</h1>
        <div className="bg-red-500/10 text-red-500 border border-red-500 p-4 rounded">
          Erro ao carregar reservas: {error.message}
        </div>
      </div>
    );
  }

  // Group by slot_date > slot_time > tour_id
  const groups: Record<string, any[]> = {};

  reservations?.forEach((res) => {
    const key = `${res.slot_date}_${res.slot_time}_${res.tour_id}`;
    if (!groups[key]) {
      groups[key] = {
        date: res.slot_date,
        time: res.slot_time,
        tourId: res.tour_id,
        totalBuggies: 0,
        reservations: [],
      };
    }
    groups[key].reservations.push(res);
    groups[key].totalBuggies += res.number_of_buggies;
  });

  const groupedArray = Object.values(groups).sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });

  // Today string for highlighting
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading text-brand-white uppercase mb-2">Saídas</h1>
        <p className="text-brand-gray-text">Agrupamento de reservas por dia, hora e tour para facilitar a operação.</p>
      </div>

      <div className="space-y-6">
        {groupedArray.length === 0 ? (
          <div className="bg-brand-gray border border-brand-gray-light rounded p-8 text-center text-brand-gray-text">
            Não há saídas agendadas.
          </div>
        ) : (
          groupedArray.map((group, idx) => {
            const isToday = group.date === todayStr;
            const tour = getTourById(group.tourId) || { name: group.tourId };

            return (
              <div
                key={idx}
                className={`border rounded-lg overflow-hidden ${
                  isToday ? "border-brand-orange shadow-aggressive-sm" : "border-brand-gray-light"
                }`}
              >
                <div className={`p-4 flex items-center justify-between ${
                  isToday ? "bg-brand-orange/10" : "bg-brand-gray"
                }`}>
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-gray-light p-2 rounded">
                      <CarFront className={`w-5 h-5 ${isToday ? "text-brand-orange" : "text-brand-white"}`} />
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${isToday ? "text-brand-orange" : "text-brand-white"}`}>
                        {formatDate(group.date)} às {group.time}
                      </h3>
                      <p className="text-sm text-brand-gray-text">Tour: {tour.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-brand-white">{group.totalBuggies}</div>
                    <div className="text-xs text-brand-gray-text uppercase tracking-wider">Buggies Total</div>
                  </div>
                </div>
                
                <div className="bg-brand-gray-light/20 p-4">
                  <div className="space-y-3">
                    {group.reservations.map((res: any) => (
                      <div key={res.id} className="bg-brand-gray p-3 rounded border border-brand-gray-light flex items-center justify-between">
                        <div>
                          <div className="font-medium text-brand-white flex items-center gap-2">
                            {res.customer_name}
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                              res.status === 'confirmed' ? 'bg-green-500/10 text-green-500' :
                              res.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'
                            }`}>
                              {res.status}
                            </span>
                          </div>
                          <div className="text-xs text-brand-gray-text font-mono mt-1">Ref: {res.booking_ref}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-bold text-brand-white flex items-center justify-end gap-1">
                              {res.number_of_buggies} <CarFront className="w-3 h-3" />
                            </div>
                            <div className="text-[10px] text-brand-gray-text">{res.number_of_buggies * 2} pax max</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
