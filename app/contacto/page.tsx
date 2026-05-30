import type { Metadata } from 'next';
import ContactForm from '@/components/contacto/ContactForm';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { FacebookIcon, InstagramIcon } from '@/components/ui/icons';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Entra em contacto com a Viana Buggy. Marca o teu passeio de buggy, tira dúvidas ou pede informações para grupos.',
};

export default function ContactoPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-orange text-sm font-body font-semibold tracking-widest uppercase">
            Fala Connosco
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-white mt-3 mb-4">
            ENTRA EM <span className="text-brand-orange">CONTACTO</span>
          </h1>
          <p className="font-body text-white/70 max-w-2xl mx-auto">
            Tens alguma dúvida sobre os nossos passeios? Queres organizar um evento para um grupo ou empresa? Estamos aqui para ajudar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info & Map */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-brand-gray border border-brand-gray-light p-6 rounded-sm">
                <Phone size={24} className="text-brand-orange mb-4" />
                <h3 className="font-heading text-xl font-bold text-white mb-2">Telefone / WhatsApp</h3>
                <a href="tel:+351923040807" className="text-brand-gray-text hover:text-brand-orange font-body transition-colors">
                  +351 923 040 807
                </a>
              </div>
              
              <div className="bg-brand-gray border border-brand-gray-light p-6 rounded-sm">
                <Mail size={24} className="text-brand-orange mb-4" />
                <h3 className="font-heading text-xl font-bold text-white mb-2">E-mail</h3>
                <a href="mailto:vianabuggy@gmail.com" className="text-brand-gray-text hover:text-brand-orange font-body transition-colors">
                  vianabuggy@gmail.com
                </a>
              </div>
            </div>

            <div className="bg-brand-gray border border-brand-gray-light p-6 rounded-sm">
              <MapPin size={24} className="text-brand-orange mb-4" />
              <h3 className="font-heading text-xl font-bold text-white mb-2">Localização</h3>
              <p className="text-brand-gray-text font-body mb-4">
                R. da Zona Industrial fase 2 pav. Nº 9<br />
                4935-232 Neiva, Viana do Castelo
              </p>
              
              <div className="rounded-sm overflow-hidden h-64 border border-brand-gray-light">
                <iframe
                  src="https://maps.google.com/maps?q=41.636735,-8.766170&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização Viana Buggy"
                />
              </div>
            </div>

            {/* Direct WhatsApp CTA */}
            <a
              href="https://wa.me/message/S6TSV37E4PR5A1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white font-heading font-bold tracking-wider px-8 py-5 rounded-sm transform -skew-x-3 hover:bg-[#1ebd5b] transition-all shadow-lg shadow-[#25D366]/20"
            >
              <span className="skew-x-3 flex items-center gap-2">
                <MessageCircle size={24} />
                FALAR AGORA NO WHATSAPP
              </span>
            </a>

            {/* Socials */}
            <div>
              <h3 className="font-heading text-lg font-bold text-white mb-4">SEGUE-NOS</h3>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/vianaBuggy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-brand-gray-light rounded-sm flex items-center justify-center text-white hover:bg-brand-orange transition-all duration-300 transform hover:-skew-x-3"
                >
                  <FacebookIcon size={20} />
                </a>
                <a
                  href="https://www.instagram.com/vianabuggy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-brand-gray-light rounded-sm flex items-center justify-center text-white hover:bg-brand-orange transition-all duration-300 transform hover:-skew-x-3"
                >
                  <InstagramIcon size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-brand-gray border border-brand-gray-light p-8 md:p-10 rounded-sm">
            <h3 className="font-heading text-2xl font-bold text-white mb-6">ENVIA-NOS UMA MENSAGEM</h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
