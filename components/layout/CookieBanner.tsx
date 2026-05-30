'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('vb-cookie-consent');
    if (!consent) {
      // Small delay for a smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('vb-cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('vb-cookie-consent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 animate-fade-in-up">
      <div className="max-w-4xl mx-auto bg-brand-gray border border-brand-gray-light rounded-lg p-6 shadow-2xl shadow-black/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-heading text-lg font-bold text-white mb-2">
              🍪 Este site utiliza cookies
            </h3>
            <p className="text-brand-gray-text text-sm font-body leading-relaxed">
              Utilizamos cookies para melhorar a tua experiência, analisar o tráfego e personalizar conteúdo. 
              Ao clicar em &quot;Aceitar&quot;, consentes a utilização de todos os cookies. 
              Consulta a nossa{' '}
              <a href="/cookies" className="text-brand-orange hover:underline">
                Política de Cookies
              </a>{' '}
              para mais informações.
            </p>
          </div>
          <button
            onClick={handleReject}
            className="text-brand-gray-text hover:text-white transition-colors shrink-0"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <button
            onClick={handleAccept}
            className="bg-brand-orange text-white font-heading font-bold text-sm tracking-wider px-6 py-2.5 rounded-sm hover:bg-brand-orange-light transition-colors duration-200"
          >
            ACEITAR TODOS
          </button>
          <button
            onClick={handleReject}
            className="bg-brand-gray-light text-white font-heading font-bold text-sm tracking-wider px-6 py-2.5 rounded-sm hover:bg-brand-gray-light/80 transition-colors duration-200 border border-brand-gray-light"
          >
            REJEITAR
          </button>
          <a
            href="/cookies"
            className="text-brand-gray-text hover:text-brand-orange text-sm font-body transition-colors duration-200"
          >
            Personalizar
          </a>
        </div>
      </div>
    </div>
  );
}
