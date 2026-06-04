import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { Users, Car, Clock } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0; // Disable caching

export default async function StaffTodayPage() {
  const supabase = await createClient();
  const today = format(new Date(), 'yyyy-MM-dd');

  // Fetch reservations for today
  const { data: reservations, error } = await supabase
    .from('reservations')
    .select(`
      *,
      tours_config:tour_id (
        id,
        name
      )
    `)
    .eq('slot_date', today)
    .neq('status', 'cancelado');

  if (error) {
    console.error('Error fetching reservations:', error);
    return <div className="text-red-500">Erro ao carregar reservas.</div>;
  }

  // Group by slot_time and tour_id
  const grouped = reservations.reduce((acc, curr) => {
    const key = `${curr.slot_time}_${curr.tour_id}`;
    if (!acc[key]) {
      acc[key] = {
        time: curr.slot_time,
        tourId: curr.tour_id,
        tourName: curr.tours_config?.name || 'Tour Desconhecido',
        totalPeople: 0,
        buggies2: 0,
        buggies4: 0,
      };
    }
    
    acc[key].totalPeople += curr.people_count;
    
    if (curr.buggy_type === '2 Lugares' || curr.buggy_type === '2_seater') {
      acc[key].buggies2 += curr.buggy_quantity;
    } else if (curr.buggy_type === '4 Lugares' || curr.buggy_type === '4_seater') {
      acc[key].buggies4 += curr.buggy_quantity;
    } else {
      // Fallback if not specified clearly, assume 2-seater or check people
      acc[key].buggies2 += curr.buggy_quantity;
    }
    
    return acc;
  }, {} as Record<string, any>);

  const salidas = Object.values(grouped).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Saídas de Hoje</h1>
        <p className="text-brand-gray-text">{format(new Date(), 'dd/MM/yyyy')}</p>
      </header>

      {salidas.length === 0 ? (
        <div className="bg-brand-gray border border-brand-gray-light rounded-xl p-8 text-center">
          <p className="text-brand-gray-text text-lg">Não há saídas agendadas para hoje.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {salidas.map((saida) => (
            <Link 
              key={`${saida.time}-${saida.tourId}`} 
              href={`/staff/saida/${today}/${saida.time.replace(':', '-')}/${saida.tourId}/checkin`}
              className="block group"
            >
              <div className="bg-brand-gray border border-brand-gray-light rounded-xl p-6 transition-all duration-300 hover:border-brand-orange hover:shadow-aggressive-sm h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full text-sm font-bold">
                    <Clock className="w-4 h-4" />
                    {saida.time}
                  </div>
                  <div className="text-right">
                    <h3 className="font-heading font-bold text-xl leading-tight group-hover:text-brand-orange transition-colors">
                      {saida.tourName}
                    </h3>
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-brand-gray-light">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand-gray-light p-2 rounded-lg">
                      <Car className="w-5 h-5 text-brand-white" />
                    </div>
                    <div>
                      <p className="text-xs text-brand-gray-text">Buggies</p>
                      <p className="font-bold text-lg leading-none mt-1">
                        {saida.buggies2 + saida.buggies4}
                      </p>
                      <p className="text-[10px] text-brand-gray-text mt-1">
                        {saida.buggies2}x 2L • {saida.buggies4}x 4L
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-brand-gray-light p-2 rounded-lg">
                      <Users className="w-5 h-5 text-brand-white" />
                    </div>
                    <div>
                      <p className="text-xs text-brand-gray-text">Pessoas</p>
                      <p className="font-bold text-lg leading-none mt-1">
                        {saida.totalPeople}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
