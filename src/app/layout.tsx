import type { Metadata } from 'next';
import MuiProvider from '@/providers/MuiProvider';
import { Poppins, Dancing_Script } from 'next/font/google';
import { ToasterProvider } from '@/components/toaster/ToasterProvider';

export const metadata: Metadata = {
  title: 'Vought International',
  description: 'Ecommerce',
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <body className={poppins.className} style={{ margin: 0, padding: 0, minHeight: '100vh', overflow: 'hidden' }}>
        <MuiProvider>
          <ToasterProvider>
            {children}
          </ToasterProvider>
        </MuiProvider>
      </body>
    </html>
  );
}
