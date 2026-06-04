import { createClient } from '@/lib/supabase/server';
import { format, addDays } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Calendar, Car, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function StaffWeekPage() {
  const supabase = await createClient();
  
  // Generate next 7 days
  const today = new Date();
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(today, i);
    return {
      date: format(d, 'yyyy-MM-dd'),
      label: i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : format(d, 'EEEE', { locale: pt }),
      dayMonth: format(d, 'dd/MM')
    };
  });

  const dates = next7Days.map(d => d.date);

  // Fetch reservations for next 7 days
  const { data: reservations, error } = await supabase
    .from('reservations')
    .select('slot_date, slot_time, tour_id, buggy_quantity, status')
    .in('slot_date', dates)
    .neq('status', 'cancelado');

  if (error) {
    console.error('Error fetching week reservations:', error);
    return <div className="text-red-500">Erro ao carregar dados.</div>;
  }

  // Aggregate by date
  const aggregatedByDate = next7Days.map(dayObj => {
    const dayReservations = reservations?.filter(r => r.slot_date === dayObj.date) || [];
    
    // Count unique saídas
    const uniqueSaidas = new Set(dayReservations.map(r => `${r.slot_time}_${r.tour_id}`)).size;
    
    // Count total buggies
    const totalBuggies = dayReservations.reduce((acc, r) => acc + r.buggy_quantity, 0);

    return {
      ...dayObj,
      uniqueSaidas,
      totalBuggies
    };
  });

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Próximos 7 Dias</h1>
        <p className="text-brand-gray-text">Resumo da semana</p>
      </header>

      <div className="flex flex-col gap-4">
        {aggregatedByDate.map((day) => {
          const hasSaidas = day.uniqueSaidas > 0;
          
          return (
            <div 
              key={day.date}
              className={`
                flex items-center justify-between p-5 rounded-xl border
                ${hasSaidas 
                  ? 'bg-brand-gray border-brand-gray-light hover:border-brand-orange transition-colors' 
                  : 'bg-brand-black border-brand-gray-light/50 opacity-60'}
              `}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold font-heading text-lg
                  ${day.label === 'Hoje' ? 'bg-brand-orange text-brand-white' : 'bg-brand-gray-light text-brand-gray-text'}`}>
                  {day.dayMonth.split('/')[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg capitalize">{day.label}</h3>
                  <p className="text-sm text-brand-gray-text">{day.dayMonth}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {hasSaidas ? (
                  <>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-brand-gray-text mb-1">Saídas</span>
                        <div className="flex items-center gap-1 font-bold">
                          <Calendar className="w-4 h-4 text-brand-orange" />
                          {day.uniqueSaidas}
                        </div>
                      </div>
                      <div className="w-px bg-brand-gray-light h-10"></div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-brand-gray-text mb-1">Buggies</span>
                        <div className="flex items-center gap-1 font-bold">
                          <Car className="w-4 h-4 text-brand-orange" />
                          {day.totalBuggies}
                        </div>
                      </div>
                    </div>
                    {/* Optional: Add link to a specific day view if needed later */}
                    {/* <ArrowRight className="w-5 h-5 text-brand-gray-text" /> */}
                  </>
                ) : (
                  <div className="text-brand-gray-text text-sm">Sem saídas</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
