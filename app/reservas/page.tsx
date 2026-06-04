import { Suspense } from 'react';
import type { Metadata } from 'next';
import BookingForm from '@/components/booking/BookingForm';
import { createClient } from '@/lib/supabase/server';
import { tours as fallbackTours } from '@/lib/tours';

export const metadata: Metadata = {
  title: 'Reservar Passeio',
  description: 'Reserva o teu passeio de buggy Can-Am em Viana do Castelo. Pagamento seguro, confirmação imediata. Vagas limitadas por saída.',
};

// Next.js will revalidate this page every 60 seconds or on demand
export const revalidate = 60;

export default async function ReservasPage() {
  let activeTours = fallbackTours;

  try {
    const supabase = await createClient();
    const { data: dbTours, error } = await supabase
      .from('tours_config')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (!error && dbTours && dbTours.length > 0) {
      activeTours = dbTours.map(t => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        duration: t.duration,
        durationMinutes: t.duration_minutes,
        schedule: t.schedule,
        days: t.days,
        destination: t.destination,
        description: t.description,
        itinerary: t.itinerary,
        highlights: t.highlights,
        included: t.included,
        price2Seater: t.price_2seater,
        price4Seater: t.price_4seater,
        image: t.image_url,
        icon: t.icon,
        // we add available_days and time_slots
        availableDays: t.available_days,
        timeSlots: t.time_slots,
      }));
    }
  } catch (e) {
    console.error('Failed to load tours from Supabase, using fallback', e);
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-brand-black texture-overlay">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-brand-orange text-sm font-body font-semibold tracking-widest uppercase">
            Garante o Teu Lugar
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-white mt-3">
            RESERVAR <span className="text-brand-orange">PASSEIO</span>
          </h1>
          <p className="font-body text-white/70 mt-4">
            Preenche o formulário abaixo para agendar a tua aventura.
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-brand-orange py-12 font-body animate-pulse">A carregar formulário de reservas...</div>}>
          <BookingForm initialTours={activeTours} />
        </Suspense>
      </div>
    </div>
  );
}
