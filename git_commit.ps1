git add app/page.tsx app/layout.tsx app/globals.css
git commit -m "Configuração inicial da página principal, layout global e sistema de design"

git add lib/ public/images/
git commit -m "Adiciona dados base dos passeios, imagens otimizadas e utilitários (Stripe, Email, Helpers)"

git add components/layout/ components/ui/
git commit -m "Desenvolvimento dos componentes partilhados de layout e UI"

git add app/reservas/ app/tours/ components/booking/
git commit -m "Implementação do sistema de reservas interativo e página de listagem de Tours"

git add app/voucher/ components/voucher/
git commit -m "Implementação da compra de Vouchers com pré-visualização e geração de PDF"

git add app/galeria/ app/contacto/ app/regras/ app/faq/ components/gallery/ components/contacto/ components/faq/
git commit -m "Desenvolvimento das páginas informativas: Galeria, Contacto, Regras de segurança e FAQ"

git add app/termos/ app/privacidade/ app/cookies/ app/sitemap.ts
git commit -m "Criação das páginas legais e configuração do Sitemap SEO"

git add app/api/
git commit -m "Configuração das rotas de API para integrações com Stripe, gestão de reservas e envios do Resend"

git add package.json package-lock.json
git commit -m "Atualiza dependências e packages do projeto"

git remote remove origin
git remote add origin https://github.com/jt-ribeiro/VianaBuggy.git
git branch -M main
git push -u origin main
