import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  metadataBase: new URL('https://patrikaa.vercel.app'),
  title: 'Digital Invite',
  description: 'Create your beautiful Marathi digital wedding invitation.',
  openGraph: {
    title: 'Digital Invite',
    description: 'Create your beautiful Marathi digital wedding invitation.',
    url: 'https://patrikaa.vercel.app',
    siteName: 'Digital Invite',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Digital Invite Preview',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Invite',
    description: 'Create your beautiful Marathi digital wedding invitation.',
    images: ['/og-image.jpg'],
  },
};

import { Footer } from "@/components/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400..800&family=Gotu&family=Laila:wght@300..700&family=Modak&family=Mukta:wght@200..800&family=Rozha+One&family=Sahitya:wght@400;700&family=Tiro+Devanagari+Marathi:ital@0;1&family=Yatra+One&display=swap" rel="stylesheet" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <FirebaseClientProvider>
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
