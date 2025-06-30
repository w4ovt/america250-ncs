import './globals.css';
import type { ReactNode } from 'react';
import Footer from '../components/Footer';

// Environment validation for production safety (server-side only)
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  // Dynamic import to avoid require() ESLint error
  import('../lib/env-validation').then(({ validateEnvironment }) => {
    validateEnvironment();
  }).catch((error) => {
    // Only log environment validation errors in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Environment validation could not be loaded:', error);
    }
  });
}

// Enhanced metadata for SEO and social sharing
export const metadata = {
  title: 'AMERICA250.radio | Semiquincentennial Amateur Radio Special Event',
  description: 'Join the AMERICA250.radio project—celebrating the 250th anniversary of American Independence with amateur radio events, the Chasing Cornwallis Challenge, and K4A Kilo4America. Volunteer as a Net Control Operator and be part of history!',
  keywords: 'AMERICA250, America 250, Semiquincentennial, Semiquin, Amateur Radio, Ham Radio, Chasing Cornwallis Challenge, K4A Kilo4America, American Revolution, Southern Campaign, Revolutionary War, Independence Day, Declaration of Independence, Net Control Operator, Radio Special Event, W4OVT, QSL cards, activation tracking',
  authors: [{ name: 'Marc Bowen W4OVT', url: 'https://america250.radio' }],
  creator: 'Marc Bowen W4OVT',
  publisher: 'America250 Amateur Radio Event',
  applicationName: 'America250 Official Portal',
  openGraph: {
    title: 'AMERICA250.radio | Semiquincentennial Amateur Radio Special Event',
    description: 'Celebrate America\'s 250th anniversary with amateur radio events, the Chasing Cornwallis Challenge, and K4A Kilo4America. Volunteer and be part of history!',
    url: 'https://america250.radio',
    siteName: 'AMERICA250.radio',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://america250.radio/america250-ncs-header-image.webp',
        width: 800,
        height: 509,
        alt: 'America250 Amateur Radio Event Portal'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AMERICA250.radio | Semiquincentennial Amateur Radio Special Event',
    description: 'Join the AMERICA250.radio project—celebrating the 250th anniversary of American Independence with amateur radio events, the Chasing Cornwallis Challenge, and K4A Kilo4America.',
    creator: '@W4OVT',
    images: ['https://america250.radio/america250-ncs-header-image.webp']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  category: 'Amateur Radio Events',
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://america250.radio'
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Critical Font Preloading */}
        <link
          rel="preload"
          href="/fonts/librebaskerville-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/librebaskerville-bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/oldclaude.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        
        {/* Performance Optimization Hints */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//qrz.com" />
        <link rel="preconnect" href="https://america250.radio" />
        <link rel="preconnect" href="https://qrz.com" crossOrigin="anonymous" />
        
        {/* Critical CSS Resource Hints */}
        {/* CSS is automatically optimized and inlined by Next.js 15 */}
        
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
        
        {/* Performance Monitoring */}
        <meta name="generator" content="Next.js 15.3.4" />
        
        {/* Structured Data for Search Engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://america250.radio/#website",
                  "url": "https://america250.radio/",
                  "name": "AMERICA250.radio - Semiquincentennial Amateur Radio Special Event",
                  "description": "Official AMERICA250.radio portal for America's Semiquincentennial amateur radio celebration featuring the Chasing Cornwallis Challenge and K4A Kilo4America",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://america250.radio/?s={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "Organization",
                  "@id": "https://america250.radio/#organization",
                  "name": "AMERICA250.radio Semiquincentennial Amateur Radio Event",
                  "url": "https://america250.radio/",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://america250.radio/america250-ncs-header-image.webp"
                  },
                  "foundingDate": "2024",
                  "description": "AMERICA250.radio amateur radio commemoration of America's Semiquincentennial featuring the Chasing Cornwallis Challenge and K4A Kilo4America special event stations",
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "Event Coordinator",
                    "email": "marc@history.radio"
                  }
                },
                {
                  "@type": "Event",
                  "@id": "https://america250.radio/#event",
                  "name": "AMERICA250.radio Semiquincentennial Amateur Radio Special Event",
                  "description": "Nationwide amateur radio special event commemorating America's Semiquincentennial with the Chasing Cornwallis Challenge and K4A Kilo4America stations",
                  "startDate": "2025-07-04",
                  "endDate": "2026-07-04",
                  "eventStatus": "EventScheduled",
                  "eventAttendanceMode": "MixedEventAttendanceMode",
                  "location": {
                    "@type": "Place",
                    "name": "United States",
                    "geo": {
                      "@type": "GeoCoordinates",
                      "latitude": 39.8283,
                      "longitude": -98.5795
                    }
                  },
                  "organizer": {
                    "@id": "https://america250.radio/#organization"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
