import '../../styles/globals.css';
import type { ReactNode } from 'react';
import HamburgerMenu from '../components/HamburgerMenu';

export const metadata = {
  title: 'America250-NCS',
  description: 'National Communications System Event Portal',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>America250-NCS</title>
      </head>
      <body className="parchment-bg">
        <HamburgerMenu />
        <div className="container linen-block">
          {children}
        </div>
      </body>
    </html>
  );
}
