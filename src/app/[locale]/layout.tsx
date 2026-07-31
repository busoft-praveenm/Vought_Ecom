import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "../globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Vought Ecom",
  description: "Experience the next generation of digital commerce",
};
import { Toaster } from "@/components/toaster";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  return (
    <html
      lang={locale}
      className={`${lato.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
