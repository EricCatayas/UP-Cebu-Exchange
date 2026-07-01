import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { CookieProvider } from '@/contexts/CookieContext';
import { SessionProvider } from '@/contexts/SessionContext';
import { ModalProvider } from '@/contexts/ModalContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { Modal } from '@/components/Modal/Modal';
import { APP_NAME } from '@/lib/constants';
import { getMetadataBase } from '@/lib/seo';
import '@/app/globals.css';
import '@/styles/fonts.css';

// Todo: update fonts
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: 'Discover and rent student-made artworks from the University of the Philippines Cebu.',
  applicationName: APP_NAME,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    title: APP_NAME,
    description: 'Discover and rent student-made artworks from the University of the Philippines Cebu.',
    siteName: APP_NAME,
    locale: 'en_PH',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: 'Discover and rent student-made artworks from the University of the Philippines Cebu.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <AuthProvider>
          <CookieProvider>
            <SessionProvider>
              <ModalProvider>
                <SidebarProvider>
                  <Modal />
                  {children}
                </SidebarProvider>
              </ModalProvider>
            </SessionProvider>
          </CookieProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
