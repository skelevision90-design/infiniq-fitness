import type { Metadata } from 'next';
import { Hanken_Grotesk } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-hanken',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'INFINIQ Fitness Club | 24/7 Athletic Sanctuary, Jalandhar',
  description:
    'A new revolution in fitness. Premium quiet luxury gym and wellness sanctuary opening soon on Mall Road, Jalandhar, Punjab. Open 24/7.',
  keywords: [
    'gym jalandhar',
    'luxury fitness punjab',
    '24/7 gym jalandhar',
    'INFINIQ fitness club',
    'pilates jalandhar',
    'crossfit jalandhar',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={hanken.variable}>
      <body className="min-h-screen bg-[#07090C] text-white/70 antialiased selection:bg-[#27D0FF]/20 selection:text-white">
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
