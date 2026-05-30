'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const whatsappLink = process.env.NEXT_PUBLIC_WHATSAPP_LINK || 'https://wa.me/message/S6TSV37E4PR5A1';

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      aria-label="Falar connosco no WhatsApp"
    >
      {/* Tooltip */}
      <div
        className={`absolute bottom-full right-0 mb-3 whitespace-nowrap transition-all duration-300 ${
          showTooltip
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <div className="bg-white text-brand-black text-sm font-body font-semibold px-4 py-2 rounded-lg shadow-lg relative">
          Fala connosco!
          <div className="absolute -bottom-1 right-6 w-2 h-2 bg-white transform rotate-45" />
        </div>
      </div>

      {/* Button */}
      <div className="relative">
        {/* Pulse ring */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20" />
        
        {/* Main button */}
        <div className="relative w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 whatsapp-float group-hover:shadow-xl group-hover:shadow-[#25D366]/40 transition-shadow duration-300">
          <MessageCircle size={28} className="text-white" fill="white" />
        </div>
      </div>
    </a>
  );
}
