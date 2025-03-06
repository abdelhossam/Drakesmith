import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@/components/analytics';
import { ParticlesBackground } from '@/components/particles-background';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nft-forge.vercel.app'),
  title: 'NFT Forge - Craft Your Digital Legacy',
  description: 'A next-generation NFT forging platform for creating unique digital assets on Polygon',
  openGraph: {
    title: 'NFT Forge - Craft Your Digital Legacy',
    description: 'A next-generation NFT forging platform for creating unique digital assets on Polygon',
    type: 'website',
    locale: 'en_US',
    url: 'https://nft-forge.vercel.app',
    siteName: 'NFT Forge',
    images: [
      {
        url: 'https://nft-forge.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NFT Forge Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NFT Forge - Craft Your Digital Legacy',
    description: 'A next-generation NFT forging platform for creating unique digital assets on Polygon',
    images: ['https://nft-forge.vercel.app/og-image.png']
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-white relative">
          <ParticlesBackground />
          <Providers>
            <main className="relative z-10">
              {children}
            </main>
          </Providers>
          <Toaster />
          <Analytics />
        </div>
      </body>
    </html>
  );
}