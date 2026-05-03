import Footer from '@/components/Footer'
import Header from '@/components/Header'
import MiniCart from '@/components/MiniCart'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
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

// Component that forces the window to the top on every route change
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
function ThemeInitializer() {
  useEffect(() => {
    // Hex to HSL Helper function
    const hexToHSL = (hex: string) => {
      let r = 0,
        g = 0,
        b = 0
      if (hex.length === 4) {
        r = parseInt('0x' + hex[1] + hex[1])
        g = parseInt('0x' + hex[2] + hex[2])
        b = parseInt('0x' + hex[3] + hex[3])
      } else if (hex.length === 7) {
        r = parseInt('0x' + hex[1] + hex[2])
        g = parseInt('0x' + hex[3] + hex[4])
        b = parseInt('0x' + hex[5] + hex[6])
      }
      r /= 255
      g /= 255
      b /= 255
      const cmax = Math.max(r, g, b),
        cmin = Math.min(r, g, b),
        delta = cmax - cmin
      let h = 0,
        s = 0,
        l = 0
      if (delta === 0) h = 0
      else if (cmax === r) h = ((g - b) / delta) % 6
      else if (cmax === g) h = (b - r) / delta + 2
      else h = (r - g) / delta + 4
      h = Math.round(h * 60)
      if (h < 0) h += 360
      l = (cmax + cmin) / 2
      s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
      return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
    }

    const savedTheme = localStorage.getItem('site_theme')
    if (savedTheme) {
      const colors = JSON.parse(savedTheme)
      Object.entries(colors).forEach(([key, hex]) => {
        document.documentElement.style.setProperty(key, hexToHSL(hex as string))
      })
    }
  }, [])

  return null
}

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {/* Placed immediately inside BrowserRouter to listen to route changes */}
            <ScrollToTop />
            <ThemeInitializer />
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
