import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Shield,
  Car,
  Mountain,
  Users,
  ChevronRight,
  Star,
  Clock,
  MapPin,
  Heart,
  Briefcase,
  UserCheck,
  Quote,
} from 'lucide-react';
import { tours } from '@/lib/tours';

export const metadata: Metadata = {
  title: 'Viana Buggy — Passeios Off-Road de Buggy em Viana do Castelo',
  description:
    'Vive a adrenalina do off-road com a Viana Buggy! Passeios guiados de buggy Can-Am pelas paisagens selvagens do Minho. Tours desde €75. Reserva já!',
};

const whyChooseUs = [
  {
    icon: UserCheck,
    title: 'Guia Certificado',
    description: 'Instrutor experiente acompanha-te em todo o percurso com segurança máxima.',
  },
  {
    icon: Car,
    title: 'Buggies Can-Am',
    description: 'Veículos profissionais de alta performance, preparados para qualquer terreno.',
  },
  {
    icon: Mountain,
    title: 'Paisagens do Minho',
    description: 'Trilhos exclusivos com vistas panorâmicas para o mar e as montanhas.',
  },
  {
    icon: Users,
    title: 'Para Toda a Família',
    description: 'Buggies de 2 e 4 lugares. Crianças a partir dos 6 anos são bem-vindas.',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Escolhe o Tour',
    description: 'Seleciona entre 3 percursos únicos pelas montanhas do Minho.',
  },
  {
    step: '02',
    title: 'Faz a Reserva',
    description: 'Reserva online com pagamento seguro por cartão ou MBWay.',
  },
  {
    step: '03',
    title: 'Diverte-te!',
    description: 'Aparece nas nossas instalações em Neiva e vive uma aventura inesquecível.',
  },
];

const testimonials = [
  {
    name: 'Ricardo Silva',
    location: 'Porto',
    rating: 5,
    text: 'Experiência absolutamente incrível! O percurso pelo Monte do Cresto é de cortar a respiração. O guia foi espetacular e os buggies são uma máquina. Voltamos com certeza!',
  },
  {
    name: 'Ana Ferreira',
    location: 'Braga',
    rating: 5,
    text: 'Ofereci o tour Sunset ao meu marido como presente de aniversário. Foi a melhor prenda que lhe podíamos ter dado! O pôr do sol visto do monte é mágico. Recomendo a 100%.',
  },
  {
    name: 'Pedro & Família Costa',
    location: 'Lisboa',
    rating: 5,
    text: 'Viemos de propósito a Viana para fazer o tour de buggy e valeu cada quilómetro! Os nossos filhos adoraram. O tour do Monte S. Gonçalo é perfeito para famílias aventureiras.',
  },
];

const idealPara = [
  { icon: Heart, title: 'Casais', description: 'Uma experiência romântica e emocionante' },
  { icon: Users, title: 'Famílias', description: 'Diversão para miúdos e graúdos' },
  { icon: Star, title: 'Amigos', description: 'Aventura em grupo inesquecível' },
  { icon: Briefcase, title: 'Empresas', description: 'Team building com adrenalina' },
];

const galleryImages = [
  { src: '/images/hero-buggy.png', alt: 'Buggy Can-Am em trilho off-road' },
  { src: '/images/tour-monte-cresto.png', alt: 'Vista do Monte do Cresto' },
  { src: '/images/tour-monte-sgoncalo.png', alt: 'Travessia de rio no Monte S. Gonçalo' },
  { src: '/images/tour-sunset.png', alt: 'Pôr do sol no tour noturno' },
  { src: '/images/gallery-mud-trail.png', alt: 'Buggies em trilho de lama' },
  { src: '/images/gallery-river-crossing.png', alt: 'Ponte de pedra sobre o Rio Neiva' },
  { src: '/images/gallery-family.png', alt: 'Família em buggy 4 lugares' },
  { src: '/images/gallery-panoramic.png', alt: 'Vista panorâmica do Minho' },
];

export default function HomePage() {
  return (
    <>
      {/* ═══════════════════════════════════
          HERO SECTION — Fullscreen
          ═══════════════════════════════════ */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-buggy.png"
            alt="Buggy Can-Am em ação nos trilhos do Minho"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Dark overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black/70 via-brand-black/50 to-brand-black" />
          {/* Orange accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-orange to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full px-5 py-2 mb-8">
            <Shield size={14} className="text-brand-orange" />
            <span className="text-brand-orange text-xs font-body font-semibold tracking-wider uppercase">
              Licenciado pelo Turismo de Portugal — RNAAT: 377/2023
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tight mb-6">
            VIVE A{' '}
            <span className="text-gradient-orange">ADRENALINA</span>
            <br />
            DO OFF-ROAD
          </h1>

          {/* Subtitle */}
          <p className="font-body text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Passeios de Buggy Can-Am pelas paisagens selvagens do Minho.
            <br className="hidden sm:block" />
            Adrenalina. Paisagem. Liberdade.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tours"
              className="group flex items-center gap-2 bg-transparent border-2 border-white text-white font-heading font-bold text-lg tracking-wider px-8 py-4 rounded-sm hover:bg-white hover:text-brand-black transition-all duration-300"
            >
              VER TOURS
              <ChevronRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/reservas"
              className="flex items-center gap-2 bg-brand-orange text-white font-heading font-bold text-lg tracking-wider px-8 py-4 rounded-sm transform -skew-x-3 hover:bg-brand-orange-light hover:animate-pulse-cta transition-all duration-300 shadow-lg shadow-brand-orange/30"
            >
              <span className="skew-x-3">RESERVAR AGORA</span>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-subtle">
            <span className="text-white/40 text-xs font-body tracking-widest uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          WHY CHOOSE US
          ═══════════════════════════════════ */}
      <section className="py-24 bg-brand-black relative texture-overlay">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-brand-orange text-sm font-body font-semibold tracking-widest uppercase">
              Porquê escolher-nos
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-black text-white mt-3">
              A EXPERIÊNCIA <span className="text-brand-orange">VIANA BUGGY</span>
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="group bg-brand-gray border border-brand-gray-light rounded-sm p-8 hover:border-brand-orange/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-aggressive-sm"
              >
                <div className="w-14 h-14 bg-brand-orange/10 rounded-sm flex items-center justify-center mb-6 group-hover:bg-brand-orange/20 transition-colors duration-300 transform -skew-x-3">
                  <item.icon size={28} className="text-brand-orange skew-x-3" />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-brand-gray-text text-sm font-body leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          TOURS PREVIEW
          ═══════════════════════════════════ */}
      <section className="py-24 bg-brand-gray relative">
        {/* Diagonal top */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-brand-black" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 100%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-orange text-sm font-body font-semibold tracking-widest uppercase">
              Os Nossos Tours
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-black text-white mt-3">
              ESCOLHE A TUA <span className="text-brand-orange">AVENTURA</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <div
                key={tour.id}
                className="group bg-brand-black border border-brand-gray-light rounded-sm overflow-hidden hover:border-brand-orange/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-aggressive"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={tour.image}
                    alt={tour.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent" />
                  {/* Duration badge */}
                  <div className="absolute top-4 right-4 bg-brand-orange text-white text-xs font-heading font-bold px-3 py-1.5 rounded-sm transform -skew-x-3">
                    <span className="skew-x-3 flex items-center gap-1">
                      <Clock size={12} />
                      {tour.duration}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-heading text-2xl font-bold text-white mb-2">
                    {tour.name}
                  </h3>
                  <p className="text-brand-gray-text text-sm font-body mb-4 line-clamp-2">
                    {tour.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-end gap-4 mb-6">
                    <div>
                      <span className="text-brand-gray-text text-xs font-body">2 lugares</span>
                      <p className="font-heading text-2xl font-black text-brand-orange">
                        €{tour.price2Seater}
                      </p>
                    </div>
                    <div>
                      <span className="text-brand-gray-text text-xs font-body">4 lugares</span>
                      <p className="font-heading text-xl font-bold text-white/60">
                        €{tour.price4Seater}
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/reservas?tour=${tour.id}`}
                    className="block w-full text-center bg-brand-orange text-white font-heading font-bold text-sm tracking-wider py-3 rounded-sm transform -skew-x-3 hover:bg-brand-orange-light hover:animate-pulse-cta transition-all duration-300"
                  >
                    <span className="skew-x-3">RESERVAR</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 text-brand-orange hover:text-brand-orange-light font-body font-semibold transition-colors"
            >
              Ver detalhes completos dos tours
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          TESTIMONIALS
          ═══════════════════════════════════ */}
      <section className="py-24 bg-brand-black relative texture-overlay">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-orange text-sm font-body font-semibold tracking-widest uppercase">
              O Que Dizem Os Nossos Clientes
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-black text-white mt-3">
              EXPERIÊNCIAS <span className="text-brand-orange">REAIS</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-brand-gray border border-brand-gray-light rounded-sm p-8 relative"
              >
                {/* Quote icon */}
                <Quote
                  size={40}
                  className="text-brand-orange/20 absolute top-6 right-6"
                />

                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-brand-orange"
                      fill="currentColor"
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-white/90 font-body text-sm leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-orange/20 rounded-full flex items-center justify-center">
                    <span className="font-heading text-brand-orange font-bold text-sm">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-body font-semibold text-white text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-brand-gray-text text-xs font-body flex items-center gap-1">
                      <MapPin size={10} />
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════ */}
      <section className="py-24 bg-brand-gray relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-orange text-sm font-body font-semibold tracking-widest uppercase">
              Simples e Rápido
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-black text-white mt-3">
              COMO <span className="text-brand-orange">FUNCIONA</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-brand-orange/30 via-brand-orange to-brand-orange/30" />

            {howItWorks.map((item, index) => (
              <div key={index} className="text-center relative">
                {/* Step number */}
                <div className="relative inline-flex items-center justify-center w-16 h-16 bg-brand-orange text-white font-heading text-2xl font-black rounded-sm transform -skew-x-6 mb-6 shadow-lg shadow-brand-orange/30">
                  <span className="skew-x-6">{item.step}</span>
                </div>

                <h3 className="font-heading text-xl font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-brand-gray-text text-sm font-body leading-relaxed max-w-xs mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          PHOTO GALLERY
          ═══════════════════════════════════ */}
      <section className="py-24 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-orange text-sm font-body font-semibold tracking-widest uppercase">
              Galeria
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-black text-white mt-3">
              MOMENTOS DE <span className="text-brand-orange">AVENTURA</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {galleryImages.map((img, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-sm group cursor-pointer ${
                  index === 0 || index === 5 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <div className={`relative ${index === 0 || index === 5 ? 'h-64 md:h-full' : 'h-48 md:h-56'}`}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/40 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-heading text-sm font-bold text-white bg-brand-orange/80 px-4 py-2 rounded-sm transform -skew-x-3">
                      <span className="skew-x-3">VER MAIS</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/galeria"
              className="inline-flex items-center gap-2 border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white font-heading font-bold tracking-wider px-8 py-3 rounded-sm transition-all duration-300"
            >
              VER GALERIA COMPLETA
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          IDEAL PARA
          ═══════════════════════════════════ */}
      <section className="py-20 bg-brand-gray">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-white">
              IDEAL <span className="text-brand-orange">PARA</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {idealPara.map((item, index) => (
              <div
                key={index}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-brand-orange/10 border border-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-orange/20 group-hover:border-brand-orange/40 transition-all duration-300 group-hover:scale-110">
                  <item.icon size={24} className="text-brand-orange" />
                </div>
                <h3 className="font-heading text-lg font-bold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-brand-gray-text text-xs font-body">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          URGENCY CTA BANNER
          ═══════════════════════════════════ */}
      <section className="relative py-20 bg-brand-orange overflow-hidden">
        {/* Diagonal decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -left-10 w-40 h-40 border-4 border-white transform rotate-12" />
          <div className="absolute -bottom-10 -right-10 w-60 h-60 border-4 border-white transform -rotate-12" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-4xl sm:text-5xl font-black text-white mb-4">
            VAGAS LIMITADAS POR SAÍDA
          </h2>
          <p className="font-body text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Cada tour tem lugares limitados para garantir a melhor experiência.
            Não fiques de fora — reserva já o teu lugar!
          </p>
          <Link
            href="/reservas"
            className="inline-flex items-center gap-2 bg-brand-black text-white font-heading font-bold text-lg tracking-wider px-10 py-4 rounded-sm hover:bg-brand-gray transition-all duration-300 shadow-xl"
          >
            RESERVAR AGORA
            <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════
          MAP SECTION
          ═══════════════════════════════════ */}
      <section className="py-24 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <span className="text-brand-orange text-sm font-body font-semibold tracking-widest uppercase">
                Onde Estamos
              </span>
              <h2 className="font-heading text-4xl font-black text-white mt-3 mb-6">
                ENCONTRA-NOS EM{' '}
                <span className="text-brand-orange">NEIVA</span>
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-brand-orange mt-1 shrink-0" />
                  <div>
                    <p className="font-body text-white font-semibold">
                      Instalações Viana Buggy
                    </p>
                    <p className="text-brand-gray-text text-sm font-body">
                      R. da Zona Industrial fase 2 pav. Nº 9
                      <br />
                      4935-232 Neiva, Viana do Castelo
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-brand-orange shrink-0" />
                  <p className="text-brand-gray-text text-sm font-body">
                    Sábados e Domingos — Tours às 14h00 e 15h30
                  </p>
                </div>
              </div>

              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 mt-8 text-brand-orange hover:text-brand-orange-light font-body font-semibold transition-colors"
              >
                Ver todas as formas de contacto
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Map */}
            <div className="relative rounded-sm overflow-hidden border border-brand-gray-light shadow-aggressive-sm">
              <iframe
                src="https://maps.google.com/maps?q=41.636735,-8.766170&output=embed"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Viana Buggy — Neiva, Viana do Castelo"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          TRUST BADGE
          ═══════════════════════════════════ */}
      <section className="py-12 bg-brand-gray border-t border-b border-brand-gray-light">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8">
          <div className="flex items-center gap-3">
            <Shield size={24} className="text-brand-orange" />
            <span className="font-body text-sm text-brand-gray-text">
              Licenciado pelo <span className="text-white font-semibold">Turismo de Portugal</span>
            </span>
          </div>
          <div className="w-px h-8 bg-brand-gray-light hidden sm:block" />
          <div className="flex items-center gap-3">
            <span className="font-heading text-sm font-bold text-brand-orange">RNAAT</span>
            <span className="font-body text-sm text-brand-gray-text">377/2023</span>
          </div>
          <div className="w-px h-8 bg-brand-gray-light hidden sm:block" />
          <div className="flex items-center gap-3">
            <span className="font-heading text-sm font-bold text-brand-orange">NIF</span>
            <span className="font-body text-sm text-brand-gray-text">507569245</span>
          </div>
        </div>
      </section>
    </>
  );
}
