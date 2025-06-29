import './globals.css';
import type { ReactNode } from 'react';

// Environment validation for production safety (server-side only)
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  // Dynamic import to avoid require() ESLint error
  import('../lib/env-validation').then(({ validateEnvironment }) => {
    validateEnvironment();
  }).catch((error) => {
    console.warn('Environment validation could not be loaded:', error);
  });
}

// Enhanced metadata for SEO and social sharing
export const metadata = {
  title: 'America250-NCS | Amateur Radio Event Management',
  description: 'National Communications System Event Portal for America\'s 250th anniversary celebration. Volunteer registration, activation tracking, and ADI log processing for amateur radio operators.',
  keywords: 'amateur radio, ham radio, America250, NCS, K4A, volunteer, activation, logbook, ADI, QRZ',
  authors: [{ name: 'Marc Bowen W4OVT', url: 'https://america250.radio' }],
  creator: 'Marc Bowen W4OVT',
  publisher: 'America250-NCS',
  applicationName: 'America250-NCS Event Portal',
  openGraph: {
    title: 'America250-NCS | Amateur Radio Event Management',
    description: 'Join the America250 National Communications System celebration. Volunteer registration and activation tracking for amateur radio operators.',
    url: 'https://america250.radio',
    siteName: 'America250-NCS',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'America250-NCS Event Portal',
    description: 'Join the America250 National Communications System celebration',
    creator: '@W4OVT',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  category: 'Amateur Radio',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Performance Optimization Hints */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//qrz.com" />
        <link rel="preconnect" href="https://america250.radio" />
        <link rel="preconnect" href="https://qrz.com" crossOrigin="anonymous" />
        
        {/* Icons and Manifest */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Mobile Optimization */}
        <meta name="theme-color" content="#683f1b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="America250-NCS" />
        
        {/* Additional Security Headers */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Content Type Declaration */}
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
