'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Preciso de carta de condução para conduzir o buggy?',
    answer: 'Sim, é obrigatório possuir e apresentar carta de condução válida da Categoria B (ligeiros) para poder conduzir os nossos buggies.'
  },
  {
    question: 'Qual é a idade mínima para participar?',
    answer: 'Crianças podem participar como passageiras a partir dos 6 anos de idade, desde que acompanhadas por um adulto. A idade máxima recomendada para participar, devido a questões de seguro, é de 75 anos.'
  },
  {
    question: 'O que devo trazer / como me devo vestir?',
    answer: 'Recomendamos que tragas roupa confortável e que se possa sujar (pó, lama, água). Calçado fechado é obrigatório (ténis ou botas). Nós fornecemos óculos de proteção.'
  },
  {
    question: 'Os tours funcionam em caso de chuva?',
    answer: 'Sim! A chuva até torna a experiência off-road mais divertida com a lama. Os tours só são cancelados em caso de condições meteorológicas extremas ou alertas vermelhos de segurança.'
  },
  {
    question: 'Posso trazer crianças?',
    answer: 'Sim, crianças a partir dos 6 anos são muito bem-vindas! Recomendamos a reserva de um buggy de 4 lugares (4-seater) para famílias.'
  },
  {
    question: 'Qual é a política de cancelamento?',
    answer: 'Podes cancelar ou reagendar a tua reserva até 48 horas antes da hora marcada sem qualquer custo. Cancelamentos com menos de 48h de antecedência não são reembolsáveis.'
  },
  {
    question: 'Como funciona o pagamento?',
    answer: 'Podes pagar online de forma segura com Cartão de Crédito/Débito (via Stripe) ou selecionar a opção MBWay no final da reserva.'
  },
  {
    question: 'Onde é o ponto de encontro?',
    answer: 'O ponto de encontro é nas nossas instalações em Neiva (Viana do Castelo): R. da Zona Industrial fase 2 pav. Nº 9, 4935-232 Neiva. Recomendamos chegar 15 minutos antes da hora do tour.'
  },
  {
    question: 'As tours têm guia?',
    answer: 'Sim, todos os nossos tours são guiados por um instrutor certificado que segue noutro veículo à frente para garantir a segurança e guiar o percurso.'
  },
  {
    question: 'Posso reservar para grupos ou empresas?',
    answer: 'Claro que sim! Organizamos eventos de team building, despedidas de solteiro(a) e passeios de grupo. Contacta-nos diretamente para um orçamento personalizado.'
  },
  {
    question: 'É necessário usar capacete?',
    answer: 'Não. Os nossos buggies Can-Am estão equipados com cintos de segurança de vários pontos e roll bar (gaiola de proteção), pelo que a lei não exige capacete. Fornecemos óculos de proteção contra pó/lama.'
  },
  {
    question: 'Posso trocar de condutor durante o tour?',
    answer: 'Sim! Se ambos tiverem carta de condução válida, podem trocar de lugar nas diversas paragens estratégicas que o guia faz durante o percurso.'
  }
];

export default function Accordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        
        return (
          <div 
            key={index}
            className={`border rounded-sm transition-all duration-300 overflow-hidden ${
              isOpen 
                ? 'bg-brand-gray border-brand-orange shadow-aggressive-sm' 
                : 'bg-brand-black border-brand-gray-light hover:border-white/20'
            }`}
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              aria-expanded={isOpen}
            >
              <h3 className={`font-heading text-xl font-bold pr-8 ${isOpen ? 'text-brand-orange' : 'text-white'}`}>
                {faq.question}
              </h3>
              <div 
                className={`flex-shrink-0 w-8 h-8 rounded-sm flex items-center justify-center transition-transform duration-300 transform -skew-x-3 ${
                  isOpen ? 'bg-brand-orange text-white rotate-180' : 'bg-brand-gray-light text-brand-gray-text'
                }`}
              >
                <ChevronDown size={20} className="skew-x-3" />
              </div>
            </button>
            
            <div 
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-6 pt-0 border-t border-brand-gray-light/20 mt-2">
                <p className="font-body text-white/80 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
