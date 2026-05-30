import type { Metadata } from 'next';
import Accordion from '@/components/faq/Accordion';

export const metadata: Metadata = {
  title: 'Perguntas Frequentes (FAQ)',
  description: 'Tens dúvidas sobre os nossos passeios de buggy? Encontra aqui as respostas sobre cartas de condução, idades, regras e muito mais.',
};

export default function FaqPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-brand-black texture-overlay">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-orange text-sm font-body font-semibold tracking-widest uppercase">
            Esclarece as Tuas Dúvidas
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-white mt-3 mb-4">
            PERGUNTAS <span className="text-brand-orange">FREQUENTES</span>
          </h1>
          <p className="font-body text-white/70 max-w-2xl mx-auto">
            Reunimos as respostas às perguntas mais comuns dos nossos clientes.
            Se não encontrares o que procuras, não hesites em contactar-nos.
          </p>
        </div>

        <Accordion />
        
        <div className="mt-16 text-center bg-brand-gray border border-brand-gray-light rounded-sm p-8">
          <h3 className="font-heading text-2xl font-bold text-white mb-2">Ainda tens dúvidas?</h3>
          <p className="font-body text-brand-gray-text mb-6">
            A nossa equipa está pronta para ajudar a esclarecer qualquer questão.
          </p>
          <a
            href="/contacto"
            className="inline-block bg-brand-orange text-white font-heading font-bold tracking-wider px-8 py-3 rounded-sm transform -skew-x-3 hover:bg-brand-orange-light transition-colors shadow-aggressive-sm"
          >
            <span className="skew-x-3">FALAR CONNOSCO</span>
          </a>
        </div>
      </div>
    </div>
  );
}
