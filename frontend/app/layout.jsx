import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import { CompareProvider } from '../context/CompareContext';
import { CurrencyProvider } from '../context/CurrencyContext';
import { LoyaltyProvider } from '../context/LoyaltyContext';
import CartDrawer from '../components/CartDrawer';
import WishlistDrawer from '../components/WishlistDrawer';
import CompareModal from '../components/CompareModal';
import CompareFloatingBar from '../components/CompareFloatingBar';
import LoyaltyModal from '../components/LoyaltyModal';
import AuthModal from '../components/AuthModal';
import ToastContainer from '../components/ToastContainer';

export const metadata = {
  title: 'ShopSphere | Event-Driven Microservices E-Commerce Platform',
  description: 'Enterprise Java 21, Spring Boot 3, Kafka Saga Orchestration, Redis Caching, and Next.js Storefront.',
  keywords: 'microservices, e-commerce, spring boot, kafka, redis, nextjs, saga pattern'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-indigo-500 selection:text-white font-sans">
        <CurrencyProvider>
          <CartProvider>
            <AuthProvider>
              <WishlistProvider>
                <CompareProvider>
                  <LoyaltyProvider>
                    <ToastContainer />
                    {children}
                    <CartDrawer />
                    <WishlistDrawer />
                    <CompareModal />
                    <CompareFloatingBar />
                    <LoyaltyModal />
                    <AuthModal />
                  </LoyaltyProvider>
                </CompareProvider>
              </WishlistProvider>
            </AuthProvider>
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
