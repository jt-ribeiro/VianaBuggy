'use client';

import { usePathname } from 'next/navigation';
import { Navbar, Footer, WhatsAppButton, CookieBanner, UrgencyBanner } from '@/components/layout';

export default function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBackoffice = pathname?.startsWith('/admin') || pathname?.startsWith('/staff');

  return (
    <>
      {!isBackoffice && <UrgencyBanner />}
      {!isBackoffice && <Navbar />}
      
      <main className="flex-1">{children}</main>
      
      {!isBackoffice && <Footer />}
      {!isBackoffice && <WhatsAppButton />}
      {!isBackoffice && <CookieBanner />}
    </>
  );
}
