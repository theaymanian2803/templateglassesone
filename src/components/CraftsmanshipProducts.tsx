import { Button } from '@/components/ui/button'
import { supabase } from '@/integrations/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ChevronRight, ShoppingBag } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// --- 1. Types ---
interface Product {
  id: string
  name: string
  price: number
  description: string | null
  image_urls: string[] | null
  category_name: string // Normalized category name
}

// --- 2. Framer Motion Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 80, damping: 18 },
  },
}

export default function CraftsmanshipProducts() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // --- Drag to Scroll State ---
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [hasDragged, setHasDragged] = useState(false)

  // --- 3. Data Fetching ---

  // Fetch Products (Selecting all fields + relational category data)
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['best-selling-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        // Using * gets everything, and categories(*) joins all relational category data
        .select('*, categories(*)')
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error

      // Map the data to our Product interface
      return (data || []).map((p: any) => {
        let catName = 'Uncategorized'

        if (p.categories) {
          if (Array.isArray(p.categories) && p.categories[0]?.name) {
            catName = p.categories[0].name
          } else if (p.categories.name) {
            catName = p.categories.name
          }
        } else if (p.category) {
          catName = p.category
        }

        return {
          id: p.id,
          name: p.name,
          price: p.price,
          description: p.description,
          image_urls: p.image_urls,
          category_name: catName,
        }
      }) as Product[]
    },
    staleTime: 5 * 60 * 1000,
  })

  // --- Carousel Controls (Buttons) ---
  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 350 + 32
      const currentScroll = carouselRef.current.scrollLeft
      carouselRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  // --- Mouse Drag Handlers for Desktop Swiping ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return
    setIsDragging(true)
    setHasDragged(false)
    setStartX(e.pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
  }

  const handleMouseLeave = () => setIsDragging(false)
  const handleMouseUp = () => setIsDragging(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return
    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 2

    if (Math.abs(walk) > 5) setHasDragged(true)
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

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
    <main className="w-full bg-background border-t border-border/50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-10 py-16 lg:py-24 space-y-16">
        {/* --- A. Header Section --- */}
        <section className="grid md:grid-cols-[2fr,1fr] gap-x-12 gap-y-8 items-start">
          <div className="space-y-6">
            <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tighter leading-[0.95]">
              Best - <br /> selling Glasses
            </h1>

            {/* Navigation Pills */}
            <div className="flex flex-wrap gap-2 items-center pt-2">
              <Button
                size="icon"
                variant="secondary"
                onClick={() => scroll('left')}
                className="rounded-full bg-[#19232c] text-white hover:bg-[#2a3b4c] shrink-0 mr-2 hidden md:flex">
                <ChevronRight size={20} className="rotate-[180deg]" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                onClick={() => scroll('right')}
                className="rounded-full bg-[#19232c] text-white hover:bg-[#2a3b4c] shrink-0 mr-4 hidden md:flex">
                <ChevronRight size={20} />
              </Button>

              <Button
                variant="link"
                onClick={() => navigate('/products')}
                className="text-[#1a2b3c] font-sans font-medium hover:text-[#2a3b4c] px-4">
                See All Products →
              </Button>
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
        <section className="relative">
          {products.length === 0 ? (
            <div className="w-full py-24 flex flex-col items-center justify-center border border-dashed border-border/60 rounded-2xl bg-muted/10">
              <p className="font-serif text-2xl text-foreground mb-2">No products found</p>
            </div>
          ) : (
            <motion.div
              ref={carouselRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className={`flex overflow-x-auto gap-6 lg:gap-8 pb-10 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-4 md:pr-10 ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab snap-x snap-mandatory'
              }`}
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
                    <Link
                      to={productUrl}
                      onClick={(e) => {
                        if (hasDragged) e.preventDefault()
                      }}
                      className="block w-full h-full space-y-4 cursor-pointer">
                      {/* --- Product Card with Beveled Corners --- */}
                      <div
                        className="bg-white p-8 space-y-6 relative border border-border/50 transition-shadow hover:shadow-lg h-full flex flex-col pointer-events-none"
                        style={{
                          clipPath:
                            'polygon(20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%, 0% 20px)',
                        }}>
                        {/* 1. Category Tag */}
                        <div className="flex items-center justify-center gap-1.5 pt-1">
                          <span className="w-4 h-[1px] bg-border"></span>
                          <p className="font-sans text-xs font-medium text-muted-foreground tracking-tight uppercase truncate max-w-[120px]">
                            {product.category_name}
                          </p>
                          <span className="w-4 h-[1px] bg-border"></span>
                        </div>

                        {/* 2. Main Product Image */}
                        <div className="w-full aspect-[3/2] flex items-center justify-center overflow-hidden flex-1">
                          <img
                            src={firstImage}
                            alt={product.name}
                            className="w-auto h-full object-contain transition-transform duration-500 ease-in-out group-hover:scale-105 mix-blend-multiply"
                            loading="lazy"
                            draggable="false"
                          />
                        </div>

                        {/* 3. Product Details */}
                        <div className="flex flex-col gap-1.5 pb-2 mt-auto">
                          <h3 className="font-sans text-lg font-semibold text-[#1a2b3c] truncate tracking-tight">
                            {product.name}
                          </h3>
                          <p className="font-serif text-xl lg:text-2xl font-medium text-foreground/90">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>

                        {/* --- Action Button --- */}
                        <div className="absolute bottom-6 right-6 pointer-events-auto">
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
          )}
        </section>
      </div>
    </main>
  )
}
