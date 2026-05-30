import type { Metadata } from 'next';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import { Camera } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Galeria de Fotos',
  description: 'Vê as melhores fotos dos nossos passeios de buggy off-road em Viana do Castelo. Paisagens incríveis, trilhos com lama e muita adrenalina.',
};

export default function GaleriaPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-brand-black texture-overlay">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-orange/10 rounded-full mb-6">
            <Camera size={32} className="text-brand-orange" />
          </div>
          <span className="text-brand-orange text-sm font-body font-semibold tracking-widest uppercase block">
            A Nossa Experiência
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-white mt-3 mb-4">
            GALERIA DE <span className="text-brand-orange">FOTOS</span>
          </h1>
          <p className="font-body text-white/70 max-w-2xl mx-auto">
            Explora os momentos de pura adrenalina e as paisagens deslumbrantes que os nossos clientes vivem nos tours da Viana Buggy.
          </p>
        </div>

        <GalleryGrid />
      </div>
    </div>
  );
}
