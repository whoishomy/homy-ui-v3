import type { Metadata } from 'next';
import { Roboto, Roboto_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { FilterProvider } from '@/contexts/FilterContext';

const roboto = Roboto({
  weight: '400',
  variable: '--font-roboto',
  subsets: ['latin'],
});

const robotoMono = Roboto_Mono({
  weight: '400',
  variable: '--font-roboto-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HOMY UI v3',
  description: 'Modern health analytics dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={`${roboto.variable} ${robotoMono.variable}`}>
        <FilterProvider>{children}</FilterProvider>
      </body>
    </html>
  );
}
