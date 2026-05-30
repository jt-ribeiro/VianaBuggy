import type { Metadata } from 'next';
import VoucherForm from '@/components/voucher/VoucherForm';
import { Gift } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Comprar Vale Presente',
  description: 'Oferece uma aventura inesquecível! Compra um vale presente para os nossos passeios de buggy no Minho.',
};

export default function VoucherPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-brand-black texture-overlay">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-orange/10 rounded-full mb-6">
            <Gift size={32} className="text-brand-orange" />
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-white mb-4">
            OFERECE UMA <span className="text-brand-orange">AVENTURA</span>
          </h1>
          <p className="font-body text-white/70 max-w-2xl mx-auto">
            O presente perfeito para quem gosta de adrenalina e natureza. 
            Personaliza o teu vale presente abaixo e recebe-o imediatamente em formato PDF.
          </p>
        </div>

        <VoucherForm />
      </div>
    </div>
  );
}
