import Navbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';
import CookieConsent from '@/components/CookieConsent/CookieConsent';
import { Sidebar } from '@/components/customer/Sidebar/Sidebar';
import { CartProvider } from '@/contexts/CartContext';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <CartProvider>
        <Sidebar />
        {children}
      </CartProvider>
      <Footer />
      <CookieConsent />
    </>
  );
}
