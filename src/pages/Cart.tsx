import { useCart } from '@/contexts/CartContext'
import { Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Cart() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart()

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <ShoppingBag size={48} className="text-muted-foreground mb-6" />
        <h1 className="font-serif text-2xl mb-2">Your Cart is Empty</h1>
        <p className="text-sm font-sans text-muted-foreground mb-8">
          Discover our curated collection of premium eyewear.
        </p>
        <Link to="/products" className="btn-luxury">
          Continue Shopping
        </Link>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 md:px-8 py-12 max-w-5xl">
      <h1 className="font-serif text-2xl md:text-3xl mb-8">Shopping Cart ({itemCount})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items */}
        <div className="lg:col-span-2 space-y-0 divide-y divide-border">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-4 md:gap-6 py-6 first:pt-0">
              <Link to={`/product/${item.product.id}`}>
                <img
                  src={item.product.image_urls?.[0] || '/placeholder.svg'}
                  alt={item.product.name}
                  className="w-24 h-24 md:w-32 md:h-32 object-cover bg-muted"
                  loading="lazy"
                  width={128}
                  height={128}
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = '/placeholder.svg'
                  }}
                />
              </Link>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link
                    to={`/product/${item.product.id}`}
                    className="font-serif text-sm md:text-base hover:underline">
                    {item.product.name}
                  </Link>
                  <p className="text-xs font-sans text-muted-foreground mt-1 capitalize">
                    {item.product.category} · {item.product.material}
                  </p>
                  {item.prescription_type && item.prescription_type !== 'none' && (
                    <p className="text-xs font-sans text-muted-foreground mt-0.5 capitalize">
                      Prescription: {item.prescription_type}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-sans w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors">
                  <X size={16} />
                </button>
                <p className="text-sm font-sans font-medium">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-muted p-6 sticky top-24">
            <h2 className="font-serif text-lg mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm font-sans">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            <div className="border-t border-border mt-4 pt-4 flex justify-between text-sm font-sans font-medium">
              <span>Estimated Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="btn-luxury w-full text-center mt-6">
              Proceed to Checkout
            </Link>
            <Link
              to="/products"
              className="block text-center text-xs font-sans text-muted-foreground hover:text-foreground mt-4 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
