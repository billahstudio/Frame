import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ASUS ExpertBook Ultra Frame Generator',
  description:
    'Generate official ASUS ExpertBook Ultra promotional framed photos with client-side canvas precision, instant live preview, and high-resolution export.',
  keywords: [
    'ASUS',
    'ExpertBook Ultra',
    'Frame Generator',
    'Photo Frame',
    'Canvas Editor',
  ],
  authors: [{ name: 'ASUS Studio' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#07080a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#07080a] text-zinc-100 selection:bg-cyan-500/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
