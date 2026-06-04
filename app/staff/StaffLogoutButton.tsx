'use client';

import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function StaffLogoutButton({ isMobile = false }: { isMobile?: boolean }) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  if (isMobile) {
    return (
      <button 
        onClick={handleLogout}
        className="flex flex-col items-center gap-1 text-xs font-semibold text-brand-gray-text hover:text-red-500 active:text-red-500 transition-colors mt-2"
      >
        <LogOut className="w-6 h-6" />
        Sair
      </button>
    );
  }

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-2 text-brand-gray-text hover:text-red-500 transition-colors ml-6 border-l border-brand-gray-light pl-6"
    >
      <LogOut className="w-5 h-5" />
      <span className="font-semibold">Sair</span>
    </button>
  );
}
