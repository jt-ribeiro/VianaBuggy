import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Clock,
  Calendar,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Mountain,
  Compass,
  Sunset,
  Gift,
  Star,
  Users,
  Shield,
} from 'lucide-react';
import { tours } from '@/lib/tours';

export const metadata: Metadata = {
  title: 'Tours e Preços',
  description:
    'Descobre os nossos 3 tours de buggy off-road em Viana do Castelo: Monte do Cresto (75min, desde €75), Monte S. Gonçalo (135min, desde €125) e Sunset & Night Tour (150min, desde €150). Reserva já!',
};

const iconMap: Record<string, React.ElementType> = {
  Mountain,
  Compass,
  Sunset,
};

export default function ToursPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-brand-black">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/gallery-panoramic.png"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-brand-black/90 to-brand-black" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <span className="text-brand-orange text-sm font-body font-semibold tracking-widest uppercase">
            Os Nossos Percursos
          </span>
          <h1 className="font-heading text-5xl sm:text-6xl font-black text-white mt-3 mb-4">
            TOURS E <span className="text-brand-orange">PREÇOS</span>
          </h1>
          <p className="font-body text-lg text-white/70 max-w-2xl mx-auto">
            Três experiências únicas pelas montanhas e trilhos do Minho.
            Todos os preços são por buggy — leva quem quiseres!
          </p>
        </div>
      </section>

      {/* Tour Cards */}
      <section className="py-24 bg-brand-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {tours.map((tour, index) => {
            const IconComponent = iconMap[tour.icon] || Mountain;
            const isReverse = index % 2 === 1;

            return (
              <div
                key={tour.id}
                id={tour.slug}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  isReverse ? 'lg:direction-rtl' : ''
                }`}
              >
                {/* Image */}
                <div className={`relative rounded-sm overflow-hidden shadow-aggressive ${isReverse ? 'lg:order-2' : ''}`}>
                  <div className="relative h-80 sm:h-96 lg:h-[500px]">
                    <Image
                      src={tour.image}
                      alt={tour.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 to-transparent" />

                    {/* Duration badge */}
                    <div className="absolute top-6 left-6 bg-brand-orange text-white font-heading font-bold px-4 py-2 rounded-sm transform -skew-x-3">
                      <span className="skew-x-3 flex items-center gap-2">
                        <Clock size={16} />
                        {tour.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={isReverse ? 'lg:order-1' : ''}>
                  {/* Tour icon & name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-brand-orange/10 rounded-sm flex items-center justify-center transform -skew-x-3">
                      <IconComponent size={24} className="text-brand-orange skew-x-3" />
                    </div>
                    <div>
                      <span className="text-brand-orange text-xs font-body font-semibold tracking-widest uppercase">
                        Tour {index + 1}
                      </span>
                      <h2 className="font-heading text-3xl sm:text-4xl font-black text-white">
                        {tour.name}
                      </h2>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="font-body text-white/80 leading-relaxed mb-6">
                    {tour.description}
                  </p>

                  {/* Meta info */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-brand-orange" />
                      <span className="text-sm text-brand-gray-text font-body">
                        {tour.days}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-brand-orange" />
                      <span className="text-sm text-brand-gray-text font-body">
                        {tour.schedule}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <MapPin size={16} className="text-brand-orange" />
                      <span className="text-sm text-brand-gray-text font-body">
                        {tour.destination}
                      </span>
                    </div>
                  </div>

                  {/* Itinerary */}
                  <div className="mb-6">
                    <h3 className="font-heading text-lg font-bold text-white mb-3">
                      ITINERÁRIO
                    </h3>
                    <ol className="space-y-2">
                      {tour.itinerary.map((step, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-6 h-6 bg-brand-orange/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-brand-orange text-xs font-heading font-bold">
                              {i + 1}
                            </span>
                          </span>
                          <span className="text-sm text-white/70 font-body">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Included */}
                  <div className="mb-8">
                    <h3 className="font-heading text-lg font-bold text-white mb-3">
                      O QUE ESTÁ INCLUÍDO
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {tour.included.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-brand-orange shrink-0" />
                          <span className="text-sm text-white/70 font-body">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-end justify-between bg-brand-black border border-brand-gray-light rounded-sm p-6">
                    <div>
                      <div className="flex items-end gap-6">
                        <div>
                          <span className="text-brand-gray-text text-xs font-body block">Buggy 2 Lugares</span>
                          <span className="font-heading text-4xl font-black text-brand-orange">
                            €{tour.price2Seater}
                          </span>
                        </div>
                        <div>
                          <span className="text-brand-gray-text text-xs font-body block">Buggy 4 Lugares</span>
                          <span className="font-heading text-2xl font-bold text-white/60">
                            €{tour.price4Seater}
                          </span>
                        </div>
                      </div>
                      <p className="text-brand-gray-text text-xs font-body mt-2">
                        Preço por buggy (não por pessoa)
                      </p>
                    </div>

                    <Link
                      href={`/reservas?tour=${tour.id}`}
                      className="bg-brand-orange text-white font-heading font-bold text-sm tracking-wider px-8 py-3 rounded-sm transform -skew-x-3 hover:bg-brand-orange-light hover:animate-pulse-cta transition-all duration-300 shadow-lg shadow-brand-orange/30 shrink-0"
                    >
                      <span className="skew-x-3 flex items-center gap-2">
                        RESERVAR
                        <ChevronRight size={16} />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tour Comparison Table */}
      <section className="py-24 bg-brand-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-brand-orange text-sm font-body font-semibold tracking-widest uppercase">
              Comparação
            </span>
            <h2 className="font-heading text-4xl font-black text-white mt-3">
              COMPARA OS <span className="text-brand-orange">TOURS</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-brand-orange">
                  <th className="text-left font-heading text-sm font-bold text-brand-gray-text py-4 px-4">
                    Característica
                  </th>
                  {tours.map((tour) => (
                    <th key={tour.id} className="text-center font-heading text-lg font-bold text-white py-4 px-4">
                      {tour.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Duração', values: tours.map(t => t.duration) },
                  { label: 'Horário', values: tours.map(t => t.schedule) },
                  { label: 'Dias', values: tours.map(t => t.days) },
                  { label: 'Destino', values: tours.map(t => t.destination) },
                  { label: 'Preço 2 Lug.', values: tours.map(t => `€${t.price2Seater}`) },
                  { label: 'Preço 4 Lug.', values: tours.map(t => `€${t.price4Seater}`) },
                  { label: 'Travessia Rio', values: ['✓', '✓', '—'] },
                  { label: 'Pôr do Sol', values: ['—', '—', '✓'] },
                  { label: 'Noturno', values: ['—', '—', '✓'] },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-brand-gray-light hover:bg-brand-gray/50 transition-colors">
                    <td className="font-body text-sm text-brand-gray-text py-4 px-4 font-medium">
                      {row.label}
                    </td>
                    {row.values.map((val, j) => (
                      <td key={j} className="text-center font-body text-sm text-white py-4 px-4">
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="py-6 px-4" />
                  {tours.map((tour) => (
                    <td key={tour.id} className="py-6 px-4 text-center">
                      <Link
                        href={`/reservas?tour=${tour.id}`}
                        className="inline-flex bg-brand-orange text-white font-heading font-bold text-xs tracking-wider px-6 py-2.5 rounded-sm transform -skew-x-3 hover:bg-brand-orange-light transition-all duration-300"
                      >
                        <span className="skew-x-3">RESERVAR</span>
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Voucher CTA */}
      <section className="py-20 bg-brand-gray border-t border-brand-gray-light">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-orange/10 rounded-full mb-6">
            <Gift size={32} className="text-brand-orange" />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-white mb-4">
            OFERECER UMA <span className="text-brand-orange">EXPERIÊNCIA</span>
          </h2>
          <p className="font-body text-lg text-white/70 mb-8 max-w-xl mx-auto">
            Surpreende alguém especial com um vale presente de buggy off-road.
            O presente perfeito para quem gosta de aventura!
          </p>
          <Link
            href="/voucher"
            className="inline-flex items-center gap-2 bg-brand-orange text-white font-heading font-bold text-lg tracking-wider px-8 py-4 rounded-sm transform -skew-x-3 hover:bg-brand-orange-light hover:animate-pulse-cta transition-all duration-300 shadow-lg shadow-brand-orange/30"
          >
            <span className="skew-x-3 flex items-center gap-2">
              <Gift size={20} />
              COMPRAR VALE PRESENTE
            </span>
          </Link>
        </div>
      </section>

      {/* Trust */}
      <section className="py-12 bg-brand-black border-t border-brand-gray-light">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-brand-orange" />
            <span className="font-body text-sm text-brand-gray-text">
              Turismo de Portugal — <span className="text-white">RNAAT: 377/2023</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Star size={20} className="text-brand-orange" fill="currentColor" />
            <span className="font-body text-sm text-brand-gray-text">
              Seguro <span className="text-white">incluído</span> em todos os tours
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={20} className="text-brand-orange" />
            <span className="font-body text-sm text-brand-gray-text">
              Guia <span className="text-white">certificado</span> em todos os percursos
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
