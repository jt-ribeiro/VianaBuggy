import type { Metadata } from 'next';
import BookingForm from '@/components/booking/BookingForm';

export const metadata: Metadata = {
  title: 'Reservar Passeio',
  description: 'Reserva o teu passeio de buggy Can-Am em Viana do Castelo. Pagamento seguro, confirmação imediata. Vagas limitadas por saída.',
};

export default function ReservasPage() {
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

        <BookingForm />
      </div>
    </div>
  );
}
