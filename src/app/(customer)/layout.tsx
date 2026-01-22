import Navbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';
import { CookieProvider } from '@/contexts/CookieContext';
import CookieConsent from '@/components/CookieConsent/CookieConsent';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <CookieProvider>
      <Navbar />
      {children}
      <Footer />
      <CookieConsent />
    </CookieProvider>
  );
}
