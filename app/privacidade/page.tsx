import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Como a Viana Buggy recolhe, trata e protege os teus dados pessoais.',
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-brand-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl sm:text-5xl font-black text-white mb-8">
          POLÍTICA DE <span className="text-brand-orange">PRIVACIDADE</span>
        </h1>
        
        <div className="prose prose-invert prose-brand max-w-none font-body text-white/80 space-y-6">
          <p>Última atualização: {new Date().toLocaleDateString('pt-PT')}</p>
          
          <h2 className="text-2xl font-heading font-bold text-white mt-10 mb-4">1. Identificação do Responsável pelo Tratamento</h2>
          <p>
            A RC Adventures (operadora da marca "Viana Buggy"), com sede na R. da Zona Industrial fase 2 pav. Nº 9, 4935-232 Neiva, Viana do Castelo, 
            é a entidade responsável pelo tratamento dos dados pessoais recolhidos através deste website (www.vianabuggy.pt).
          </p>

          <h2 className="text-2xl font-heading font-bold text-white mt-10 mb-4">2. Que dados recolhemos?</h2>
          <p>No âmbito da nossa atividade, recolhemos os seguintes dados pessoais:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Dados de Identificação:</strong> Nome completo.</li>
            <li><strong>Dados de Contacto:</strong> Endereço de e-mail e número de telefone/telemóvel.</li>
            <li><strong>Dados de Pagamento:</strong> Tratados por entidades externas (ex: Stripe). O nosso website não armazena os dados integrais do seu cartão de crédito.</li>
            <li><strong>Dados de Navegação:</strong> Endereço IP, tipo de navegador, páginas visitadas (recolhidos através de cookies essenciais e analíticos).</li>
          </ul>

          <h2 className="text-2xl font-heading font-bold text-white mt-10 mb-4">3. Finalidade e Base Licitude</h2>
          <p>Os seus dados são tratados para as seguintes finalidades:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Gestão de Reservas:</strong> Processamento da sua reserva, comunicação de horários, envio de confirmações e faturas (Execução de contrato).</li>
            <li><strong>Apoio ao Cliente:</strong> Resposta a pedidos de contacto e esclarecimento de dúvidas (Interesse legítimo).</li>
            <li><strong>Obrigações Legais:</strong> Comunicação de dados às autoridades competentes quando exigido por lei, faturação (Obrigação legal).</li>
          </ul>

          <h2 className="text-2xl font-heading font-bold text-white mt-10 mb-4">4. Partilha de Dados</h2>
          <p>
            Os seus dados pessoais apenas serão partilhados com entidades terceiras quando estritamente necessário para o normal funcionamento dos nossos serviços, nomeadamente:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Plataformas de processamento de pagamentos (Stripe).</li>
            <li>Serviços de alojamento web e bases de dados em servidores europeus.</li>
            <li>Autoridades fiscais (para efeitos de faturação).</li>
          </ul>
          <p>Garantimos que não vendemos os seus dados a terceiros.</p>

          <h2 className="text-2xl font-heading font-bold text-white mt-10 mb-4">5. Retenção de Dados</h2>
          <p>
            Os dados pessoais são conservados apenas durante o período necessário para as finalidades para as quais foram recolhidos.
            Dados relativos a faturação são guardados pelo período exigido por lei (geralmente 10 anos em Portugal).
          </p>

          <h2 className="text-2xl font-heading font-bold text-white mt-10 mb-4">6. Os Seus Direitos</h2>
          <p>Ao abrigo do RGPD, tem o direito de:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Solicitar o <strong>acesso</strong> aos seus dados pessoais.</li>
            <li>Pedir a <strong>retificação</strong> de dados inexatos ou incompletos.</li>
            <li>Solicitar o <strong>apagamento</strong> dos seus dados (direito ao esquecimento), salvo se existirem obrigações legais em contrário.</li>
            <li>Pedir a <strong>limitação</strong> ou <strong>opor-se</strong> ao tratamento.</li>
            <li>Solicitar a <strong>portabilidade</strong> dos dados.</li>
          </ul>
          <p>
            Para exercer qualquer um destes direitos, contacte-nos através do e-mail: <strong>vianabuggy@gmail.com</strong>.
          </p>

          <h2 className="text-2xl font-heading font-bold text-white mt-10 mb-4">7. Segurança dos Dados</h2>
          <p>
            Implementámos medidas técnicas e organizativas adequadas para proteger os seus dados pessoais contra a destruição acidental ou ilícita, a perda acidental, a alteração, a difusão ou o acesso não autorizado (ex: utilização de protocolo HTTPS/SSL em todo o website).
          </p>
        </div>
      </div>
    </div>
  );
}
