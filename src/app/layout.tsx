import '../../styles/globals.css';
import type { ReactNode } from 'react';

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
      <body>
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  );
}
