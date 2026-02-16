import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { CookieProvider } from '@/contexts/CookieContext';
import { SessionProvider } from '@/contexts/SessionContext';
import { ModalProvider } from '@/contexts/ModalContext';
import { Modal } from '@/components/Modal/Modal';
import '@/app/globals.css';
import '@/styles/fonts.css';

// Todo: update fonts
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'UP Cebu Exchange',
  description: 'Art rental platform from the University of the Philippines Cebu',
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
                <Modal />
                {children}
              </ModalProvider>
            </SessionProvider>
          </CookieProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
