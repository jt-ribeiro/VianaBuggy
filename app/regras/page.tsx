import type { Metadata } from 'next';
import { 
  ShieldCheck, 
  Glasses, 
  Car, 
  AlertTriangle, 
  CloudRain, 
  FileCheck,
  CreditCard,
  Ban
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Regras e Segurança',
  description: 'Conhece as regras de segurança e requisitos para participar nos tours da Viana Buggy. A tua segurança é a nossa prioridade.',
};

const ruleCards = [
  {
    icon: FileCheck,
    title: 'Carta de Condução',
    content: 'É estritamente obrigatório apresentar a Carta de Condução da Categoria B (ligeiros) válida antes de iniciar o tour. Sem este documento, não será possível conduzir.'
  },
  {
    icon: Glasses,
    title: 'Equipamento',
    content: 'Fornecemos óculos de proteção contra poeiras e lama. Recomendamos roupa velha/confortável e calçado fechado (ténis ou botas). O uso de cinto de segurança é obrigatório durante todo o percurso.'
  },
  {
    icon: Car,
    title: 'Regras de Condução',
    content: 'É proibido ultrapassar o veículo do guia. Deve manter-se uma distância de segurança adequada em relação ao buggy da frente. Respeitar sempre as indicações do guia.'
  },
  {
    icon: Ban,
    title: 'Comportamento',
    content: 'É expressamente proibido conduzir sob o efeito de álcool ou drogas. Não são permitidas manobras perigosas, piões ou desvios do trilho marcado pelo guia.'
  },
  {
    icon: ShieldCheck,
    title: 'Seguros e Caução',
    content: 'O tour inclui seguro de acidentes pessoais e responsabilidade civil. Em caso de danos no veículo por condução negligente, o condutor será responsabilizado.'
  },
  {
    icon: AlertTriangle,
    title: 'Idades Permitidas',
    content: 'Idade mínima para passageiros: 6 anos (acompanhados por adulto responsável). Idade máxima recomendada para condutores/passageiros: 75 anos.'
  },
  {
    icon: CreditCard,
    title: 'Política de Cancelamento',
    content: 'Cancelamentos até 48 horas antes do tour são 100% reembolsados. Cancelamentos com menos de 48 horas de antecedência ou não comparência não conferem direito a reembolso.'
  },
  {
    icon: CloudRain,
    title: 'Condições Meteorológicas',
    content: 'Os tours realizam-se mesmo com chuva (com lama é mais divertido!). Apenas são cancelados e reembolsados/reagendados em caso de condições climatéricas extremas que coloquem a segurança em risco.'
  }
];

export default function RegrasPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-brand-black texture-overlay">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-orange text-sm font-body font-semibold tracking-widest uppercase">
            Preparação e Requisitos
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-white mt-3 mb-4">
            REGRAS E <span className="text-brand-orange">SEGURANÇA</span>
          </h1>
          <p className="font-body text-white/70 max-w-2xl mx-auto">
            A aventura é garantida, mas a segurança vem primeiro. Lê com atenção os nossos requisitos
            para garantir que a tua experiência com a Viana Buggy é memorável pelas melhores razões.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ruleCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div 
                key={index}
                className="bg-brand-gray border border-brand-gray-light rounded-sm p-6 hover:border-brand-orange transition-colors duration-300 group"
              >
                <div className="w-12 h-12 bg-brand-orange/10 rounded-sm flex items-center justify-center mb-6 transform -skew-x-3 group-hover:bg-brand-orange transition-colors duration-300">
                  <Icon size={24} className="text-brand-orange skew-x-3 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-3">
                  {card.title}
                </h3>
                <p className="font-body text-brand-gray-text text-sm leading-relaxed">
                  {card.content}
                </p>
              </div>
            );
          })}
        </div>
        
        <div className="mt-16 bg-brand-orange/10 border-l-4 border-brand-orange p-6 sm:p-8 rounded-r-sm max-w-3xl mx-auto text-center">
          <h3 className="font-heading text-xl font-bold text-white mb-2">Reserva do Direito de Admissão</h3>
          <p className="font-body text-white/80 text-sm">
            A Viana Buggy reserva-se o direito de recusar a participação ou cancelar a atividade a qualquer momento, 
            sem direito a reembolso, caso os participantes não cumpram as regras de segurança estabelecidas, 
            apresentem sinais de embriaguez ou desrespeitem as indicações do guia.
          </p>
        </div>
      </div>
    </div>
  );
}
