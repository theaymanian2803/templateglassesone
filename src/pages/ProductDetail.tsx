import RelatedProducts from '@/components/RelatedProducts'
import { useCart } from '@/contexts/CartContext'
import { useProduct } from '@/hooks/useProducts'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function ProductDetail() {
  const { id } = useParams()
  const { addItem } = useCart()
  const { data: product, isLoading } = useProduct(id)
  const [activeImage, setActiveImage] = useState<number>(0)

  if (isLoading)
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground font-sans">Loading...</p>
      </main>
    )
  if (!product)
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground font-sans">Product not found.</p>
      </main>
    )

  const images = product.image_urls

  return (
    <main className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-7xl">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft size={14} /> Back
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Luxury Image Gallery */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative aspect-[4/3] bg-[#f6f6f6] flex items-center justify-center overflow-hidden">
            <img
              src={images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {images.map((url: string, idx: number) => (
              <div
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`aspect-square bg-[#f6f6f6] cursor-pointer transition-all ${activeImage === idx ? 'ring-1 ring-inset ring-foreground' : 'opacity-80 hover:opacity-100'}`}>
                <img
                  src={url}
                  alt={`${product.name} view ${idx}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Product Info */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
          <div className="mb-2 flex items-center justify-between">
            <h1 className="font-serif text-2xl uppercase tracking-wider">{product.name}</h1>
          </div>
          <p className="text-xl font-sans mb-6">${product.price}</p>

          <div className="space-y-6">
            <div className="space-y-1 border-t border-border pt-4">
              <div className="flex justify-between items-start text-[11px] font-sans uppercase tracking-widest gap-4">
                <span className="text-muted-foreground shrink-0">Frame</span>
                <span className="text-right flex-wrap">
                  {product.material} {product.frame_shape}
                </span>
              </div>
            </div>

            <button
              onClick={() => addItem(product)}
              className="w-full bg-foreground text-white py-4 text-[11px] font-sans tracking-[0.2em] uppercase hover:opacity-90 transition-opacity">
              Add to Cart — ${product.price}
            </button>

            <div className="pt-4 border-t border-border">
              <p className="text-xs font-sans text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key}>
                  <p className="text-[10px] font-sans text-muted-foreground uppercase tracking-widest">
                    {key.replace('_', ' ')}
                  </p>
                  <p className="text-sm font-sans mt-0.5">{val as React.ReactNode}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products positioned full width below the main product details */}
      <RelatedProducts
        currentProductId={product.id}
        categoryId={product.category_id}
        legacyCategory={product.category}
      />
    </main>
  )
}
