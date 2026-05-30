import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos e Condições',
  description: 'Termos e condições de utilização dos serviços e website da Viana Buggy.',
};

export default function TermosPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-brand-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl sm:text-5xl font-black text-white mb-8">
          TERMOS E <span className="text-brand-orange">CONDIÇÕES</span>
        </h1>
        
        <div className="prose prose-invert prose-brand max-w-none font-body text-white/80 space-y-6">
          <p>Última atualização: {new Date().toLocaleDateString('pt-PT')}</p>
          
          <h2 className="text-2xl font-heading font-bold text-white mt-10 mb-4">1. Identificação da Empresa</h2>
          <p>
            O website www.vianabuggy.pt e a marca "Viana Buggy" são operados pela empresa RC Adventures.
            NIF: 507569245
            Registo Nacional de Agentes de Animação Turística (RNAAT): 377/2023
            Sede: R. da Zona Industrial fase 2 pav. Nº 9, 4935-232 Neiva, Viana do Castelo, Portugal.
          </p>

          <h2 className="text-2xl font-heading font-bold text-white mt-10 mb-4">2. Condições Gerais de Participação</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>É estritamente obrigatório a apresentação de Carta de Condução Categoria B válida para todos os condutores.</li>
            <li>A idade mínima para participar como passageiro é de 6 anos.</li>
            <li>O uso de cinto de segurança é obrigatório durante todo o percurso.</li>
            <li>É expressamente proibido participar na atividade sob o efeito de álcool, drogas ou medicamentos que afetem a capacidade de condução.</li>
            <li>Os clientes devem respeitar sempre as instruções dos guias da Viana Buggy.</li>
          </ul>

          <h2 className="text-2xl font-heading font-bold text-white mt-10 mb-4">3. Reservas e Pagamentos</h2>
          <p>
            As reservas podem ser efetuadas através do nosso website, sujeitas a disponibilidade. 
            O pagamento total da reserva deve ser efetuado no momento da marcação (via Stripe) ou num prazo máximo de 12h (via MBWay) para garantir a vaga.
            Todos os preços apresentados incluem IVA à taxa legal em vigor. O preço é cobrado por veículo (Buggy) e não por pessoa.
          </p>

          <h2 className="text-2xl font-heading font-bold text-white mt-10 mb-4">4. Política de Cancelamento e Reagendamento</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Cancelamentos até 48 horas antes do início da atividade: reembolso a 100%.</li>
            <li>Cancelamentos a menos de 48 horas ou não comparência (no-show): não conferem direito a qualquer reembolso.</li>
            <li>A Viana Buggy reserva-se o direito de cancelar a atividade devido a condições meteorológicas extremas, problemas mecânicos ou outros motivos de força maior. Nestes casos, será proposto o reagendamento ou o reembolso integral.</li>
          </ul>

          <h2 className="text-2xl font-heading font-bold text-white mt-10 mb-4">5. Responsabilidade e Seguros</h2>
          <p>
            A atividade inclui os Seguros de Responsabilidade Civil e Acidentes Pessoais exigidos por lei para a Animação Turística em Portugal.
            O cliente é totalmente responsável por qualquer dano causado ao veículo devido a condução perigosa, negligente, ou incumprimento das regras estabelecidas pelo guia.
            A Viana Buggy não se responsabiliza por objetos pessoais perdidos, danificados ou roubados durante a atividade.
          </p>

          <h2 className="text-2xl font-heading font-bold text-white mt-10 mb-4">6. Direito de Admissão</h2>
          <p>
            A organização reserva-se o direito de recusar a admissão ou de interromper a atividade de clientes cujo comportamento ponha em risco a sua segurança, a do grupo, do guia, dos veículos ou de terceiros.
          </p>

          <h2 className="text-2xl font-heading font-bold text-white mt-10 mb-4">7. Vouchers de Oferta</h2>
          <p>
            Os vouchers têm a validade de 12 meses a partir da data de emissão. Não são convertíveis em dinheiro.
            A marcação da data está sujeita à disponibilidade da agenda.
          </p>

          <h2 className="text-2xl font-heading font-bold text-white mt-10 mb-4">8. Resolução de Litígios</h2>
          <p>
            Em caso de litígio, o consumidor pode recorrer a uma Entidade de Resolução Alternativa de Litígios de Consumo.
            Foro competente: Comarca de Viana do Castelo, com expressa renúncia a qualquer outro.
          </p>
        </div>
      </div>
    </div>
  );
}
