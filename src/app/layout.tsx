import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { SessionProvider } from '@/contexts/SessionContext';
import { ModalProvider } from '@/contexts/ModalContext';
import { Modal } from '@/components/Modal/Modal';
import '@/app/globals.css';
import '@/styles/fonts.css';
import '@/styles/typography.css';

// Todo: update fonts
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'UP Cebu Art Exchange',
  description: 'Art rental platform for UP Cebu community',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <SessionProvider>
          <AuthProvider>
            <ModalProvider>
              <Modal />
              {children}
            </ModalProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
