import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import clsx from 'clsx';
import Providers from './providers';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Rallyvite - Plan & Poll Your Group Meetups',
  description:
    'Easily schedule and manage get-togethers with friends using Rallyvite.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="relative">
      <body className={clsx(poppins.className, 'antialiased bg-[#FFFFFF]')}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
