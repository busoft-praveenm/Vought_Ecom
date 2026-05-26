import type { Metadata } from 'next';
import MuiProvider from '@/providers/MuiProvider';

export const metadata: Metadata = {
  title: 'Vought International',
  description: 'Ecommerce',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MuiProvider>
          {children}
        </MuiProvider>
      </body>
    </html>
  );
}