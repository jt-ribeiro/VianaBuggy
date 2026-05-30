import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Informação sobre a utilização de cookies no website da Viana Buggy.',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-brand-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl sm:text-5xl font-black text-white mb-8">
          POLÍTICA DE <span className="text-brand-orange">COOKIES</span>
        </h1>
        
        <div className="prose prose-invert prose-brand max-w-none font-body text-white/80 space-y-6">
          <p>Última atualização: {new Date().toLocaleDateString('pt-PT')}</p>
          
          <h2 className="text-2xl font-heading font-bold text-white mt-10 mb-4">1. O que são Cookies?</h2>
          <p>
            "Cookies" são pequenos ficheiros de texto que um website, ao ser visitado, coloca no computador ou no dispositivo móvel do utilizador através do navegador de internet (browser). 
            A colocação de cookies ajudará o website a reconhecer o seu dispositivo na próxima vez que o visitar.
          </p>

          <h2 className="text-2xl font-heading font-bold text-white mt-10 mb-4">2. Que tipo de cookies utilizamos?</h2>
          <p>A Viana Buggy utiliza os seguintes tipos de cookies no seu website:</p>
          
          <h3 className="text-xl font-heading font-bold text-white mt-6 mb-2">Cookies Estritamente Necessários</h3>
          <p>
            São essenciais para o funcionamento do website. Sem estes cookies, funcionalidades como a navegação nas páginas ou a reserva de tours através do nosso sistema de pagamentos seguro não podem funcionar adequadamente. Não requerem o consentimento do utilizador.
            <br /><em>Exemplos: Cookies de sessão de segurança, identificadores de carrinho de reservas.</em>
          </p>

          <h3 className="text-xl font-heading font-bold text-white mt-6 mb-2">Cookies Analíticos (Google Analytics)</h3>
          <p>
            Utilizamos o Google Analytics 4 (GA4) para compreender como os visitantes interagem com o nosso website. 
            Estes cookies recolhem informações de forma anónima, incluindo o número de visitantes, a origem das visitas e as páginas visitadas, permitindo-nos melhorar a experiência dos utilizadores.
          </p>

          <h3 className="text-xl font-heading font-bold text-white mt-6 mb-2">Cookies de Terceiros</h3>
          <p>
            Alguns cookies são colocados por serviços de terceiros que aparecem nas nossas páginas, tais como o processador de pagamentos Stripe ou o Google Maps embebido. Estes cookies são geridos por entidades externas.
          </p>

          <h2 className="text-2xl font-heading font-bold text-white mt-10 mb-4">3. Como gerir os cookies?</h2>
          <p>
            A maioria dos navegadores permite controlo sobre os cookies armazenados no seu dispositivo, através das configurações do navegador.
            Pode configurar o seu browser para recusar todos os cookies ou para indicar quando um cookie está a ser enviado. 
          </p>
          <p>No entanto, tenha em atenção que a desativação dos cookies essenciais pode impedir que alguns serviços web (como concluir a sua reserva) funcionem corretamente.</p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">Google Chrome</a></li>
            <li><a href="https://support.apple.com/pt-pt/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">Apple Safari</a></li>
            <li><a href="https://support.mozilla.org/pt-PT/kb/ativar-e-desativar-cookies-que-os-websites-utiliza" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">Mozilla Firefox</a></li>
            <li><a href="https://support.microsoft.com/pt-pt/windows/eliminar-e-gerir-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">Microsoft Edge</a></li>
          </ul>

          <h2 className="text-2xl font-heading font-bold text-white mt-10 mb-4">4. Consentimento</h2>
          <p>
            Ao clicar em "Aceitar Todos" no nosso banner de cookies, está a consentir a utilização de todos os cookies não essenciais descritos nesta política.
          </p>
        </div>
      </div>
    </div>
  );
}
