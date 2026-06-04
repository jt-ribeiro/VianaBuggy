import Link from 'next/link';
import { ReactNode } from 'react';
import { Calendar, Clock } from 'lucide-react';
import StaffLogoutButton from './StaffLogoutButton';

export const metadata = {
  title: 'Staff Panel - Viana Buggy',
  description: 'Gestão de saídas e reservas para o staff no terreno.',
};

export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-black text-brand-white pb-20 md:pb-0 md:pt-16 font-body">
      {/* Top Nav for Desktop */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-brand-gray border-b border-brand-gray-light z-50 items-center justify-between px-6">
        <div className="text-xl font-heading font-bold text-brand-orange">
          VIANA BUGGY <span className="text-brand-white">STAFF</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/staff" className="flex items-center gap-2 hover:text-brand-orange transition-colors">
            <Clock className="w-5 h-5" />
            Hoje
          </Link>
          <Link href="/staff/semana" className="flex items-center gap-2 hover:text-brand-orange transition-colors">
            <Calendar className="w-5 h-5" />
            Semana
          </Link>
          <StaffLogoutButton />
        </nav>
      </header>

      <main className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
        {children}
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-brand-gray border-t border-brand-gray-light z-50 flex items-center justify-around pb-4">
        <Link href="/staff" className="flex flex-col items-center gap-1 text-xs font-semibold text-brand-gray-text hover:text-brand-orange active:text-brand-orange transition-colors mt-2">
          <Clock className="w-6 h-6" />
          Hoje
        </Link>
        <Link href="/staff/semana" className="flex flex-col items-center gap-1 text-xs font-semibold text-brand-gray-text hover:text-brand-orange active:text-brand-orange transition-colors mt-2">
          <Calendar className="w-6 h-6" />
          Semana
        </Link>
        <StaffLogoutButton isMobile />
      </nav>
    </div>
  );
}
