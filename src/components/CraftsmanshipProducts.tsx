import { Button } from '@/components/ui/button'
import { supabase } from '@/integrations/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ChevronRight, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'

// --- 1. Product Type Definition ---
interface Product {
  id: string
  name: string
  price: number
  description: string | null
  image_urls: string[] | null
}

// --- 2. Framer Motion Animation Variants ---
// Updated for horizontal stagger
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 18,
    },
  },
}

// --- Filter Data ---
const filters = ['Retro Revival', 'Classic', 'Blue Light', 'Sunglass']

export default function CraftsmanshipProducts() {
  // --- 3. Data Fetching ---
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['best-selling-products'],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, description, image_urls')
        .order('created_at', { ascending: false })
        .limit(8)

      if (error) {
        console.error('Error fetching craftsmanship products:', error)
        throw error
      }

      return data as Product[]
    },
    staleTime: 5 * 60 * 1000,
  })

  // --- 4. Render States ---
  if (isLoading) {
    return (
      <div className="bg-[#f0f3f8] min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <h2 className="font-serif text-4xl mb-6 tracking-tight text-foreground/90">
          Loading Best Sellers...
        </h2>
        <p className="text-sm font-sans text-muted-foreground">Finding our latest pieces...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-background min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <h2 className="font-serif text-4xl mb-6 tracking-tight text-destructive">
          Error Loading Products
        </h2>
        <p className="text-sm font-sans text-destructive/80">
          We couldn't load the best sellers. Please try refreshing the page.
        </p>
      </div>
    )
  }

  // --- 5. Main Component Render ---
  return (
    <main className="w-full bg-background border-t border-border/50">
      <div className="container mx-auto px-4 md:px-6 lg:px-10 py-16 lg:py-24 space-y-16">
        {/* --- A. Header Section --- */}
        <section className="grid md:grid-cols-[2fr,1fr] gap-x-12 gap-y-8 items-start">
          <div className="space-y-6">
            <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tighter leading-[0.95]">
              Best - <br /> selling Glasses
            </h1>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 items-center pt-2">
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full bg-[#19232c] text-white hover:bg-[#2a3b4c]">
                <ChevronRight size={20} className="rotate-[-45deg]" />
              </Button>
              {filters.map((filter) => (
                <Button
                  key={filter}
                  variant="outline"
                  className="rounded-full border-[#1a2b3c]/20 hover:bg-[#1a2b3c]/5 px-5 font-sans text-sm font-medium">
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          {/* Description Block */}
          <div className="flex justify-end md:justify-start pt-2">
            <p className="max-w-[30ch] text-base font-sans text-[#1a2b3c]/70 leading-relaxed">
              A unique <strong className="font-semibold text-[#1a2b3c]">blend of elegance</strong>,
              cutting-edge tech and affordability
            </p>
          </div>
        </section>

        {/* --- B. Animated & Scrollable Products Section --- */}
        <section>
          {/*
            Standard CSS to hide scrollbars:
            - [scrollbar-width:none] for Firefox
            - [-ms-overflow-style:none] for IE/Edge
            - [&::-webkit-scrollbar]:hidden for Chrome/Safari/Edge
          */}
          <motion.div
            className="flex overflow-x-auto gap-6 lg:gap-8 pb-10 scroll-smooth snap-x mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}>
            {products.map((product) => {
              const firstImage = product.image_urls?.[0] || '/images/product-placeholder.jpg'
              const productUrl = `/product/${product.id}`

              return (
                <motion.div
                  key={product.id}
                  className="flex-none w-[300px] md:w-[350px] snap-center lg:snap-start group"
                  variants={itemVariants}>
                  <Link to={productUrl} className="block w-full h-full space-y-4 cursor-pointer">
                    {/* --- Product Card with Beveled Corners --- */}
                    {/* Inline style for the custom polygon shape */}
                    <div
                      className="bg-white p-8 space-y-6 relative border border-border/50 transition-shadow hover:shadow-lg"
                      style={{
                        clipPath:
                          'polygon(20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%, 0% 20px)',
                      }}>
                      {/* Product Content Container */}
                      <div className="space-y-12">
                        {/* 1. Subtle 'Style' placeholder text */}
                        <div className="flex items-center justify-center gap-1.5 pt-1">
                          <span className="w-4 h-[1px] bg-border"></span>
                          <p className="font-sans text-xs font-medium text-muted-foreground tracking-tight">
                            3x Style
                          </p>
                          <span className="w-4 h-[1px] bg-border"></span>
                        </div>

                        {/* 2. Main Product Image */}
                        <div className="w-full aspect-[3/2] flex items-center justify-center overflow-hidden">
                          <img
                            src={firstImage}
                            alt={product.name}
                            className="w-auto h-full object-contain transition-transform duration-500 ease-in-out group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>

                        {/* 3. Product Details */}
                        <div className="flex flex-col gap-1.5 pb-2">
                          <h3 className="font-sans text-lg font-semibold text-[#1a2b3c] truncate tracking-tight">
                            {product.name}
                          </h3>
                          <p className="font-serif text-xl lg:text-2xl font-medium text-foreground/90">
                            ${product.price.toFixed(0)}
                          </p>
                        </div>
                      </div>

                      {/* --- Luxury Action Button --- */}
                      <div className="absolute bottom-6 right-6">
                        <div className="w-11 h-11 rounded-full border border-border bg-white flex items-center justify-center text-[#1a2b3c] transition-colors hover:bg-[#1a2b3c] hover:text-white hover:border-[#1a2b3c]">
                          <ShoppingBag size={20} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </section>
      </div>
    </main>
  )
}
