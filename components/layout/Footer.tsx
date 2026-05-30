import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FacebookIcon, InstagramIcon } from '@/components/ui/icons';

const quickLinks = [
  { href: '/tours', label: 'Tours e Preços' },
  { href: '/reservas', label: 'Reservar' },
  { href: '/voucher', label: 'Vale Presente' },
  { href: '/galeria', label: 'Galeria' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contacto', label: 'Contacto' },
];

const legalLinks = [
  { href: '/termos', label: 'Termos e Condições' },
  { href: '/privacidade', label: 'Política de Privacidade' },
  { href: '/cookies', label: 'Política de Cookies' },
  { href: '/regras', label: 'Regras e Segurança' },
  { href: 'https://www.livroreclamacoes.pt/Inicio/', label: 'Livro de Reclamações', external: true },
];

export default function Footer() {
  return (
    <footer className="bg-brand-gray border-t border-brand-gray-light">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="font-heading text-2xl font-extrabold text-white tracking-wide">
                VIANA <span className="text-brand-orange">BUGGY</span>
              </span>
            </Link>
            <p className="text-brand-gray-text text-sm font-body leading-relaxed mb-4">
              Passeios de buggy off-road pelas paisagens selvagens do Minho. 
              Adrenalina, natureza e memórias inesquecíveis.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div className="bg-brand-orange/10 border border-brand-orange/30 rounded px-3 py-1.5">
                <span className="text-brand-orange text-xs font-body font-semibold">
                  RNAAT: 377/2023
                </span>
              </div>
            </div>
            <p className="text-brand-gray-text/60 text-xs font-body mt-3">
              Licenciado pelo Turismo de Portugal
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-bold text-white mb-6 relative">
              LINKS RÁPIDOS
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-brand-orange" />
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brand-gray-text hover:text-brand-orange transition-colors duration-200 text-sm font-body"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading text-lg font-bold text-white mb-6 relative">
              CONTACTO
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-brand-orange" />
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-brand-orange mt-1 shrink-0" />
                <span className="text-brand-gray-text text-sm font-body">
                  R. da Zona Industrial fase 2 pav. Nº 9,<br />
                  4935-232 Neiva, Viana do Castelo
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-brand-orange shrink-0" />
                <a
                  href="tel:+351923040807"
                  className="text-brand-gray-text hover:text-brand-orange transition-colors text-sm font-body"
                >
                  +351 923 040 807
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-brand-orange shrink-0" />
                <a
                  href="mailto:vianabuggy@gmail.com"
                  className="text-brand-gray-text hover:text-brand-orange transition-colors text-sm font-body"
                >
                  vianabuggy@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Legal */}
          <div>
            <h3 className="font-heading text-lg font-bold text-white mb-6 relative">
              REDES SOCIAIS
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-brand-orange" />
            </h3>
            <div className="flex items-center gap-4 mb-8">
              <a href="https://www.facebook.com/vianaBuggy" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand-black flex items-center justify-center text-white/70 hover:bg-brand-orange hover:text-white transition-all transform hover:-translate-y-1">
                <FacebookIcon size={18} />
              </a>
              <a href="https://www.instagram.com/vianabuggy" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand-black flex items-center justify-center text-white/70 hover:bg-brand-orange hover:text-white transition-all transform hover:-translate-y-1">
                <InstagramIcon size={18} />
              </a>
            </div>

            <h4 className="font-heading text-sm font-bold text-white mb-3">LEGAL</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  {('external' in link && link.external) ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-gray-text hover:text-brand-orange transition-colors duration-200 text-xs font-body"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-brand-gray-text hover:text-brand-orange transition-colors duration-200 text-xs font-body"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brand-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-brand-gray-text text-xs font-body">
            © {new Date().getFullYear()} RC Adventures — Viana Buggy. Todos os direitos reservados.
          </p>
          <p className="text-brand-gray-text/50 text-xs font-body">
            NIF: 507569245
          </p>
        </div>
      </div>
    </footer>
  );
}
