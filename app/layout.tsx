import type { Metadata } from 'next';
import { Barlow_Condensed, DM_Sans } from 'next/font/google';
import { Navbar, Footer, WhatsAppButton, CookieBanner, UrgencyBanner } from '@/components/layout';
import Script from 'next/script';
import './globals.css';

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-heading',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Viana Buggy — Passeios Off-Road de Buggy em Viana do Castelo',
    template: '%s | Viana Buggy',
  },
  description:
    'Passeios de buggy Can-Am off-road pelas paisagens selvagens do Minho. Tours guiados em Viana do Castelo com vista panorâmica, travessia de rios e pura adrenalina. Reserva já!',
  keywords: [
    'buggy',
    'off-road',
    'Viana do Castelo',
    'passeios',
    'tours',
    'aventura',
    'Can-Am',
    'Minho',
    'Portugal',
    'atividades',
    'turismo aventura',
  ],
  authors: [{ name: 'Viana Buggy by RC Adventures' }],
  creator: 'RC Adventures',
  openGraph: {
    type: 'website',
    locale: 'pt_PT',
    url: 'https://www.vianabuggy.pt',
    siteName: 'Viana Buggy',
    title: 'Viana Buggy — Passeios Off-Road de Buggy em Viana do Castelo',
    description:
      'Passeios de buggy Can-Am off-road pelas paisagens selvagens do Minho. Reserva já!',
    images: [
      {
        url: '/images/hero-buggy.png',
        width: 1200,
        height: 630,
        alt: 'Buggy Can-Am em trilho off-road no Minho',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Viana Buggy — Passeios Off-Road de Buggy',
    description: 'Adrenalina. Paisagem. Liberdade. Reserva o teu passeio off-road!',
    images: ['/images/hero-buggy.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://www.vianabuggy.pt'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;

  return (
    <html
      lang="pt-PT"
      className={`${barlowCondensed.variable} ${dmSans.variable}`}
    >
      <head>
        {/* Schema.org — LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Viana Buggy by RC Adventures',
              image: 'https://www.vianabuggy.pt/images/hero-buggy.png',
              '@id': 'https://www.vianabuggy.pt',
              url: 'https://www.vianabuggy.pt',
              telephone: '+351923040807',
              email: 'vianabuggy@gmail.com',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'R. da Zona Industrial fase 2 pav. Nº 9',
                addressLocality: 'Neiva',
                addressRegion: 'Viana do Castelo',
                postalCode: '4935-232',
                addressCountry: 'PT',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 41.636735,
                longitude: -8.76617,
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Saturday', 'Sunday'],
                  opens: '09:00',
                  closes: '20:00',
                },
              ],
              priceRange: '€€',
              description:
                'Passeios de buggy Can-Am off-road pelas paisagens selvagens do Minho, Viana do Castelo.',
            }),
          }}
        />
        {/* Schema.org — TouristAttraction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'TouristAttraction',
              name: 'Passeios Off-Road Viana Buggy',
              description:
                'Tours guiados de buggy Can-Am pelas montanhas e trilhos do Minho, com vistas panorâmicas e travessias de rio.',
              url: 'https://www.vianabuggy.pt/tours',
              touristType: 'Adventure tourism',
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 41.636735,
                longitude: -8.76617,
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-brand-black text-white font-body antialiased">
        {/* Urgency Banner */}
        <UrgencyBanner />
        
        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <Footer />

        {/* WhatsApp Float */}
        <WhatsAppButton />

        {/* Cookie Consent */}
        <CookieBanner />

        {/* Google Analytics 4 */}
        {ga4Id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4Id}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
