'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, MessageCircle, Share2 } from 'lucide-react';
import { FacebookIcon } from '@/components/ui/icons';

interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

const images: GalleryImage[] = [
  { src: '/images/hero-buggy.png', alt: 'Buggy em ação no monte', category: 'Ação' },
  { src: '/images/tour-monte-cresto.png', alt: 'Passeio no Monte do Cresto', category: 'Tours' },
  { src: '/images/gallery-mud-trail.png', alt: 'Trilhos com lama', category: 'Ação' },
  { src: '/images/gallery-panoramic.png', alt: 'Vista panorâmica do Minho', category: 'Paisagem' },
  { src: '/images/tour-sunset.png', alt: 'Tour Pôr do Sol', category: 'Tours' },
  { src: '/images/gallery-river-crossing.png', alt: 'Travessia de rio em buggy', category: 'Ação' },
  { src: '/images/tour-monte-sgoncalo.png', alt: 'Buggy no Monte S. Gonçalo', category: 'Tours' },
  { src: '/images/gallery-family.png', alt: 'Família em aventura off-road', category: 'Lifestyle' },
];

export default function GalleryGrid() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  
  const showPrev = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prev) => (prev !== null ? (prev === 0 ? images.length - 1 : prev - 1) : null));
  }, []);
  
  const showNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prev) => (prev !== null ? (prev === images.length - 1 ? 0 : prev + 1) : null));
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Prevent scrolling when lightbox is open
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [lightboxIndex, showPrev, showNext]);

  const currentImage = lightboxIndex !== null ? images[lightboxIndex] : null;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://www.vianabuggy.pt/galeria';

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <div 
            key={index}
            onClick={() => openLightbox(index)}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-sm bg-brand-gray border border-brand-gray-light"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/60 transition-colors duration-300 flex flex-col justify-end p-4">
              <span className="text-brand-orange text-xs font-body font-bold uppercase tracking-widest translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                {img.category}
              </span>
              <p className="text-white font-heading font-bold text-lg translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                {img.alt}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && currentImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/95 backdrop-blur-sm p-4 md:p-12 animate-fade-in"
          onClick={closeLightbox}
        >
          {/* Controls */}
          <button 
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-6 right-6 text-white/70 hover:text-brand-orange transition-colors z-50 bg-brand-black/50 p-2 rounded-full"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          <button 
            onClick={showPrev}
            className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-white/70 hover:text-brand-orange transition-colors z-50 bg-brand-black/50 p-3 rounded-full hidden sm:block"
            aria-label="Previous image"
          >
            <ChevronLeft size={32} />
          </button>

          <button 
            onClick={showNext}
            className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-white/70 hover:text-brand-orange transition-colors z-50 bg-brand-black/50 p-3 rounded-full hidden sm:block"
            aria-label="Next image"
          >
            <ChevronRight size={32} />
          </button>

          {/* Main Image Container */}
          <div 
            className="relative w-full max-w-5xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full" style={{ height: '70vh' }}>
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                fill
                className="object-contain"
                priority
                sizes="100vw"
              />
            </div>
            
            <div className="w-full mt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-brand-gray border border-brand-gray-light p-4 rounded-sm">
              <div>
                <span className="text-brand-orange text-xs font-body font-bold uppercase tracking-widest block mb-1">
                  {currentImage.category}
                </span>
                <p className="text-white font-heading font-bold text-xl">
                  {currentImage.alt}
                </p>
                <p className="text-brand-gray-text text-sm font-body">
                  Imagem {lightboxIndex + 1} de {images.length}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-white/50 text-sm font-body flex items-center gap-2 mr-2">
                  <Share2 size={16} /> Partilhar:
                </span>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white rounded-sm flex items-center justify-center transition-colors"
                  aria-label="Partilhar no Facebook"
                >
                  <FacebookIcon size={18} />
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Vê esta foto fantástica da Viana Buggy! ${shareUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-sm flex items-center justify-center transition-colors"
                  aria-label="Partilhar no WhatsApp"
                >
                  <MessageCircle size={18} />
                </a>
              </div>
            </div>
            
            {/* Mobile swipe controls */}
            <div className="flex justify-center gap-8 mt-6 sm:hidden w-full">
              <button onClick={showPrev} className="bg-brand-gray border border-brand-gray-light p-3 rounded-full text-white/70">
                <ChevronLeft size={24} />
              </button>
              <button onClick={showNext} className="bg-brand-gray border border-brand-gray-light p-3 rounded-full text-white/70">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
