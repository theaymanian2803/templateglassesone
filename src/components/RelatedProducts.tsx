import { useProducts } from '@/hooks/useProducts'
import { Link } from 'react-router-dom'

interface RelatedProductsProps {
  currentProductId: string
  categoryId?: string | null
  legacyCategory?: string
}

export default function RelatedProducts({
  currentProductId,
  categoryId,
  legacyCategory,
}: RelatedProductsProps) {
  const { data: products, isLoading } = useProducts()

  if (isLoading || !products) return null

  // Filter products based on category_id or legacy category, excluding the current product
  const relatedProducts = products
    .filter(
      (p: any) =>
        p.id !== currentProductId &&
        ((categoryId && p.category_id === categoryId) ||
          (legacyCategory && p.category === legacyCategory))
    )
    .slice(0, 4) // Limit to 4 related items

  if (relatedProducts.length === 0) return null

  return (
    <section className="mt-24 border-t border-border pt-16">
      <h2 className="font-serif text-2xl uppercase tracking-wider mb-8">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {relatedProducts.map((product: any) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="group flex flex-col gap-3"
            onClick={() => window.scrollTo(0, 0)}>
            <div className="relative aspect-[4/3] bg-[#f6f6f6] flex items-center justify-center overflow-hidden">
              <img
                src={product.image_urls[0] || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
            <div>
              <h3 className="text-sm font-serif uppercase tracking-wider group-hover:text-muted-foreground transition-colors truncate">
                {product.name}
              </h3>
              <p className="text-sm font-sans mt-1">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
