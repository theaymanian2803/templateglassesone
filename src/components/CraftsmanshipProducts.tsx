import { supabase } from '@/integrations/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

// --- 1. Product Type Definition from your Schema ---
// Defined based on your SQL schema, representing the fields we are selecting
interface Product {
  id: string
  name: string
  price: number
  description: string | null
  image_urls: string[] | null
}

// --- 2. Framer Motion Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger animations for a domino effect
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 }, // Start off-screen and invisible
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 15,
    },
  },
}

export default function CraftsmanshipProducts() {
  // --- 3. Data Fetching with React Query & Supabase ---
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['craftsmanship-products'],
    // Explicitly define the return type of the query function to fix the 'any' error
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, description, image_urls')
        .order('created_at', { ascending: false }) // Show newest first
        .limit(8) // Restricted to 8 products as requested

      if (error) {
        console.error('Error fetching craftsmanship products:', error)
        throw error
      }

      // Cast the returned data to match our Product interface
      return data as Product[]
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  })

  // --- 4. Render States for Loading and Error ---
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-3xl mb-12 tracking-tight">Our Craftsmanship</h2>
        <p className="text-sm font-sans text-muted-foreground">Loading our latest pieces...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-3xl mb-12 tracking-tight">Our Craftsmanship</h2>
        <p className="text-sm font-sans text-destructive">
          Could not load products. Please try again.
        </p>
      </div>
    )
  }

  // --- 5. Main Component Render ---
  return (
    <main className="w-full">
      {/* --- A. Our Craftsmanship Text Section --- */}

      {/* --- B. Animated & Scrollable Products Section --- */}
      <section className="bg-muted/10 border-t border-border">
        {/*
          Added standard CSS to hide scrollbars:
          - [scrollbar-width:none] for Firefox
          - [-ms-overflow-style:none] for IE/Edge
          - [&::-webkit-scrollbar]:hidden for Chrome/Safari/Edge
        */}
        <div className="max-h-[80vh] overflow-y-auto w-full scroll-smooth snap-y mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible" // Animate when the grid enters the viewport
            viewport={{ once: true, amount: 0.1 }} // Only animate once
          >
            {products.map((product) => {
              // --- Handle Multiple Images from your Schema ---
              const firstImage = product.image_urls?.[0] || '/images/product-placeholder.jpg'
              const productUrl = `/product/${product.id}`

              return (
                <motion.div
                  key={product.id}
                  className="group relative aspect-[3/4] border-r border-b border-border hover:z-10 transition-all snap-start"
                  variants={itemVariants}>
                  <Link to={productUrl} className="block w-full h-full p-4 lg:p-6 space-y-4">
                    {/* Image Container with Hover Shift */}
                    <div className="w-full aspect-square overflow-hidden bg-muted/20">
                      <img
                        src={firstImage}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-in-out"
                        loading="lazy"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col gap-1 pb-10">
                      <h3 className="font-sans text-xs md:text-sm font-medium truncate tracking-tight">
                        {product.name}
                      </h3>
                      <p className="font-serif text-sm lg:text-base text-foreground/90">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Subtle Luxury Hover Action */}
                    <div className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full border border-foreground/30 flex items-center justify-center hover:bg-foreground hover:text-background transition-colors">
                        <Plus size={18} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>
    </main>
  )
}
