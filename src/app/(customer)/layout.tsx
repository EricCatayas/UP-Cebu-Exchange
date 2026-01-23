import Navbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';
import CookieConsent from '@/components/CookieConsent/CookieConsent';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <CookieConsent />
    </>
  );
}
