import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { TayfunProvider } from '@/contexts/TayfunContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tayfun Case Study',
  description: 'Clinical Dashboard Demo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TayfunProvider>{children}</TayfunProvider>
      </body>
    </html>
  );
}
