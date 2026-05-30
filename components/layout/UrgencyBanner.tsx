'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

export default function UrgencyBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-brand-orange text-white">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-4">
        <p className="text-sm font-body font-semibold text-center">
          🔥 Agenda o teu fim de semana — vagas a preencher!{' '}
          <Link href="/reservas" className="underline font-bold hover:no-underline">
            Reserva já →
          </Link>
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white/80 hover:text-white transition-colors shrink-0"
          aria-label="Fechar banner"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
