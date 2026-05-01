import Footer from '@/components/Footer'
import Header from '@/components/Header'
import MiniCart from '@/components/MiniCart'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AboutUs from './src/pages/AboutUs'
import Account from './src/pages/Account'
import Admin from './src/pages/Admin'
import Auth from './src/pages/Auth'
import Cart from './src/pages/Cart'
import Checkout from './src/pages/Checkout'
import EssayageDomicile from './src/pages/EssayageDomicile'
import Faq from './src/pages/Faq'
import Highlights from './src/pages/Highlights'
import Index from './src/pages/Index'
import LivraisonRetours from './src/pages/LivraisonRetours'
import NotFound from './src/pages/NotFound'
import ProductDetail from './src/pages/ProductDetail'
import Products from './src/pages/Products'

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Header />
            <MiniCart />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/highlights" element={<Highlights />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/account" element={<Account />} />

              {/* Nouvelles pages */}
              <Route path="/try-on" element={<EssayageDomicile />} />
              <Route path="/shipping" element={<LivraisonRetours />} />
              <Route path="/faq" element={<Faq />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
