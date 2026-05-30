'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, CalendarPlus, MessageCircle, ArrowLeft, MapPin } from 'lucide-react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const method = searchParams.get('method');
  const ref = searchParams.get('ref');
  
  const [reference, setReference] = useState<string | null>(ref);
  const [isMbway] = useState(method === 'mbway');

  useEffect(() => {
    // In a real app, if we have a session_id, we would fetch the booking details
    // For now we just generate a random reference if it's not provided
    if (sessionId && !reference) {
      const year = new Date().getFullYear();
      const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
      setReference(`VB-${year}-${randomStr}`);
    }
  }, [sessionId, reference]);

  const addToCalendarUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Tour+de+Buggy+-+Viana+Buggy&details=Passeio+Off-Road+com+a+Viana+Buggy&location=R.+da+Zona+Industrial+fase+2+pav.+N%C2%BA+9%2C+4935-232+Neiva%2C+Viana+do+Castelo';
  const whatsappUrl = `https://wa.me/message/S6TSV37E4PR5A1`;

  return (
    <div className="max-w-2xl mx-auto bg-brand-gray border border-brand-gray-light rounded-sm p-8 md:p-12 text-center animate-fade-in-up">
      {/* Success Icon */}
      <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/10 rounded-full mb-8 relative">
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
        <CheckCircle2 size={48} className="text-green-500 relative z-10" />
      </div>

      <h1 className="font-heading text-4xl font-black text-white mb-4">
        {isMbway ? 'PEDIDO RECEBIDO!' : 'RESERVA CONFIRMADA!'}
      </h1>

      {reference && (
        <div className="inline-block bg-brand-black border border-brand-orange/30 rounded-sm px-6 py-3 mb-8">
          <p className="text-brand-gray-text text-sm font-body mb-1">Referência da Reserva</p>
          <p className="font-heading text-2xl font-bold text-brand-orange tracking-widest">{reference}</p>
        </div>
      )}

      {isMbway ? (
        <div className="text-white/80 font-body leading-relaxed mb-10 text-left bg-brand-black/50 p-6 rounded-sm border border-brand-gray-light">
          <p className="mb-4 text-center text-brand-orange font-semibold">O teu pedido de reserva está pendente.</p>
          <p className="mb-2">Para confirmar a tua reserva, por favor efetua o pagamento por MBWay para o número:</p>
          <p className="text-xl font-bold text-white text-center my-4">+351 923 040 807</p>
          <p>Assim que o pagamento for recebido, a nossa equipa irá aprovar a reserva e receberás um email de confirmação com todos os detalhes.</p>
        </div>
      ) : (
        <p className="text-white/80 font-body text-lg leading-relaxed mb-10">
          Obrigado pela tua reserva! Enviámos um email de confirmação com todos os detalhes da tua aventura. 
          Prepara-te para muita adrenalina.
        </p>
      )}

      <div className="space-y-6">
        <div className="flex items-start gap-4 text-left bg-brand-black p-4 rounded-sm border border-brand-gray-light">
          <MapPin size={24} className="text-brand-orange shrink-0 mt-1" />
          <div>
            <h3 className="font-heading font-bold text-white text-lg">PONTO DE ENCONTRO</h3>
            <p className="text-brand-gray-text text-sm font-body mt-1">
              R. da Zona Industrial fase 2 pav. Nº 9<br />
              4935-232 Neiva, Viana do Castelo
            </p>
            <p className="text-brand-orange text-xs font-body mt-2 font-semibold">
              * Por favor, chega 15 minutos antes da hora marcada.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <a
            href={addToCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-brand-black border border-brand-gray-light text-white hover:text-brand-orange font-heading font-bold tracking-wider px-6 py-3 rounded-sm transition-all"
          >
            <CalendarPlus size={18} />
            ADICIONAR AO CALENDÁRIO
          </a>
          
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366] hover:text-white font-heading font-bold tracking-wider px-6 py-3 rounded-sm transition-all"
          >
            <MessageCircle size={18} />
            FALAR NO WHATSAPP
          </a>
        </div>

        <div className="pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-brand-gray-text hover:text-brand-orange transition-colors font-body font-semibold text-sm"
          >
            <ArrowLeft size={16} />
            Voltar à página principal
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmacaoPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-brand-black texture-overlay">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-center text-white">A carregar...</div>}>
          <ConfirmationContent />
        </Suspense>
      </div>
    </div>
  );
}
