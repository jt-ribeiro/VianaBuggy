'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/tours', label: 'Tours' },
  { href: '/galeria', label: 'Galeria' },
  { href: '/faq', label: 'FAQ' },
  { href: '/regras', label: 'Regras' },
  { href: '/contacto', label: 'Contacto' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-brand-black/95 backdrop-blur-md shadow-lg shadow-black/30 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-brand-orange rounded-sm flex items-center justify-center transform -skew-x-6 group-hover:skew-x-0 transition-transform duration-300">
                <span className="font-heading text-xl font-black text-white skew-x-6 group-hover:skew-x-0 transition-transform duration-300">
                  VB
                </span>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="font-heading text-xl font-extrabold text-white tracking-wide">
                VIANA <span className="text-brand-orange">BUGGY</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm font-medium text-white/80 hover:text-brand-orange transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* CTA Button + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/reservas"
              className="hidden sm:inline-flex items-center gap-2 bg-brand-orange text-white font-heading font-bold text-sm tracking-wider px-6 py-3 rounded-sm transform -skew-x-3 hover:bg-brand-orange-light hover:animate-pulse-cta transition-all duration-300 shadow-lg shadow-brand-orange/30"
            >
              <span className="skew-x-3">RESERVAR AGORA</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:text-brand-orange transition-colors"
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 w-80 h-full bg-brand-black border-l border-brand-gray-light transform transition-transform duration-500 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="pt-24 px-8 flex flex-col gap-2">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-heading text-2xl font-bold text-white hover:text-brand-orange transition-colors duration-200 py-3 border-b border-brand-gray-light/30"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/reservas"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-6 flex items-center justify-center bg-brand-orange text-white font-heading font-bold text-lg tracking-wider px-6 py-4 rounded-sm transform -skew-x-3 hover:bg-brand-orange-light transition-all duration-300"
            >
              <span className="skew-x-3">RESERVAR AGORA</span>
            </Link>

            {/* Contact info in mobile menu */}
            <div className="mt-8 pt-6 border-t border-brand-gray-light/30">
              <p className="text-brand-gray-text text-sm font-body">
                +351 923 040 807
              </p>
              <p className="text-brand-gray-text text-sm font-body mt-1">
                vianabuggy@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
