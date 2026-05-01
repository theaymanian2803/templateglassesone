import { Product } from '@/lib/products'
import { Link } from 'react-router-dom'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  // Use the first image from the array, fallback to placeholder if empty
  const displayImage = product.image_urls?.[0] || '/placeholder.svg'

  return (
    <Link to={`/product/${product.id}`} className="product-card block">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
          width={400}
          height={400}
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = '/placeholder.svg'
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-serif text-base">{product.name}</h3>
        <p className="text-xs font-sans text-muted-foreground mt-1 capitalize">
          {product.category} · {product.material}
        </p>
        <p className="text-sm font-sans mt-2">${product.price}</p>
      </div>
    </Link>
  )
}
