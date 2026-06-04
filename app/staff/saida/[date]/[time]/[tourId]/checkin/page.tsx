import { createClient } from '@/lib/supabase/server';
import CheckinList from './CheckinList';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function CheckinPage({
  params,
}: {
  params: Promise<{ date: string; time: string; tourId: string }>;
}) {
  const resolvedParams = await params;
  const timeStr = resolvedParams.time.replace('-', ':');
  const supabase = await createClient();

  const { data: reservations, error } = await supabase
    .from('reservations')
    .select(`
      *,
      groups(name, group_code),
      tours_config:tour_id(name)
    `)
    .eq('slot_date', resolvedParams.date)
    .eq('slot_time', timeStr)
    .eq('tour_id', resolvedParams.tourId)
    .neq('status', 'cancelado')
    .order('group_id', { ascending: true, nullsFirst: false });

  if (error || !reservations) {
    console.error('Error fetching checkin data:', error);
    return <div>Erro ao carregar dados.</div>;
  }

  if (reservations.length === 0) {
    return notFound();
  }

  const tourName = reservations[0]?.tours_config?.name || 'Tour';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/staff" className="inline-flex items-center gap-2 text-brand-orange hover:text-brand-orange-light transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar para Hoje
      </Link>

      <header className="border-b border-brand-gray-light pb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold">{tourName}</h1>
            <p className="text-brand-gray-text mt-1">
              {resolvedParams.date} às {timeStr}
            </p>
          </div>
          <div className="bg-brand-gray px-4 py-2 rounded-lg inline-block border border-brand-gray-light">
            <p className="text-sm text-brand-gray-text text-center">Total Pessoas</p>
            <p className="text-2xl font-bold text-center">{reservations.reduce((acc, r) => acc + r.people_count, 0)}</p>
          </div>
        </div>
      </header>

      <CheckinList reservations={reservations} />
    </div>
  );
}
