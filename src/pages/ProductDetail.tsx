import RelatedProducts from '@/components/RelatedProducts'
import { useCart } from '@/contexts/CartContext'
import { useProduct } from '@/hooks/useProducts'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function ProductDetail() {
  const { id } = useParams()
  const { addItem } = useCart()
  const { data: product, isLoading } = useProduct(id)
  const [activeImage, setActiveImage] = useState<number>(0)

  if (isLoading)
    return (
      <main className="w-full min-h-screen bg-background flex items-center justify-center">
        <p className="text-[#1a2b3c]/60 font-sans tracking-widest uppercase text-sm">Loading...</p>
      </main>
    )

  if (!product)
    return (
      <main className="w-full min-h-screen bg-gradient-to-br from-[#e8edf248] to-[#c5f1c060] flex items-center justify-center">
        <p className="text-[#1a2b3c]/60 font-sans tracking-widest uppercase text-sm">
          Product not found.
        </p>
      </main>
    )

  const images = product.image_urls

  return (
    <main className="w-full mt-24 lg:mt-12 min-h-screen bg-background text-[#1a2b3c] font-sans pb-24 selection:bg-[#1a2b3c] selection:text-white">
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-16 max-w-7xl">
        {/* Navigation / Back Button - Styled as a pill */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#1a2b3c]/10 rounded-full text-xs font-sans tracking-widest uppercase text-[#1a2b3c]/70 hover:text-[#1a2b3c] hover:border-[#1a2b3c]/30 hover:shadow-sm transition-all mb-10 md:mb-16 w-fit">
          <ArrowLeft size={14} /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Side: Luxury Image Gallery */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Image wrapped in the signature clipped-corner card */}
            <div
              className="relative w-full aspect-[4/3] bg-white p-6 md:p-12 border border-[#1a2b3c]/10 shadow-sm"
              style={{
                clipPath:
                  'polygon(30px 0%, 100% 0%, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0% 100%, 0% 30px)',
              }}>
              {/* Decorative detail lines mimicking the reference image measurements */}
              <div className="absolute top-1/4 left-8 w-12 h-[1px] bg-[#1a2b3c]/20 hidden md:block"></div>
              <div className="absolute bottom-1/4 right-8 w-12 h-[1px] bg-[#1a2b3c]/20 hidden md:block"></div>

              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-4 overflow-x-auto pb-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {images.map((url: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative flex-shrink-0 w-24 h-24 md:w-32 md:h-32 bg-white border p-2 transition-all duration-300 ${
                    activeImage === idx
                      ? 'border-[#1a2b3c] shadow-md'
                      : 'border-[#1a2b3c]/10 opacity-70 hover:opacity-100 hover:border-[#1a2b3c]/40'
                  }`}
                  style={{
                    clipPath:
                      'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)',
                  }}>
                  <img
                    src={url}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover mix-blend-multiply"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: Product Info */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="sticky top-24 space-y-10">
              {/* Header Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-6 h-[1px] bg-[#1a2b3c]"></span>
                  <span className="text-xs font-sans tracking-[0.2em] uppercase text-[#1a2b3c]/60">
                    Premium Collection
                  </span>
                </div>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1a2b3c] leading-[1.1] tracking-tight">
                  {product.name}
                </h1>
                <p className="font-serif text-3xl text-[#1a2b3c]/80 mt-2">${product.price}</p>
              </div>

              {/* Description */}
              <p className="text-base font-sans text-[#1a2b3c]/70 leading-relaxed font-light">
                {product.description}
              </p>

              {/* Action Area */}
              <div className="space-y-6 pt-4">
                {/* Frame Style Tag mimicking the reference pill filters */}
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#1a2b3c]/20 text-sm font-medium text-[#1a2b3c]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1a2b3c]"></span>
                    {product.frame_shape}
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#1a2b3c]/20 text-sm font-medium text-[#1a2b3c]">
                    {product.material}
                  </div>
                </div>

                <button
                  onClick={() => addItem(product)}
                  className="w-full flex items-center justify-center gap-3 bg-[#1a2b3c] text-white py-4 px-8 rounded-full text-sm font-sans font-semibold tracking-widest uppercase hover:bg-[#2a3b4c] hover:shadow-lg transition-all duration-300 group">
                  <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
                  Add to Cart
                </button>
              </div>

              {/* Specs Grid - Styled as small feature cards from the reference */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-[#1a2b3c]/10">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div
                    key={key}
                    className="bg-white p-5 border border-[#1a2b3c]/10 hover:shadow-md transition-shadow"
                    style={{
                      clipPath:
                        'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)',
                    }}>
                    <p className="text-[10px] font-bold font-sans text-[#1a2b3c]/50 uppercase tracking-widest mb-1">
                      {key.replace('_', ' ')}
                    </p>
                    <p className="text-sm font-sans text-[#1a2b3c] font-medium">
                      {val as React.ReactNode}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider before related products */}
        <div className="w-full h-[1px] bg-[#1a2b3c]/10 my-16 md:my-24"></div>

        {/* Related Products - Wrapped to ensure it adopts the background gracefully */}
        <div className="w-full">
          <RelatedProducts
            currentProductId={product.id}
            categoryId={product.category_id}
            legacyCategory={product.category}
          />
        </div>
      </div>
    </main>
  )
}
