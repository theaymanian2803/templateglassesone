import { useCart } from '@/contexts/CartContext'
import { Minus, Plus, X } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MiniCart() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, total } = useCart()

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-background z-50 shadow-2xl animate-slide-in-right">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="font-serif text-lg">Your Cart</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-foreground hover:text-muted-foreground transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <p className="text-sm font-sans text-muted-foreground text-center mt-12">
                Your cart is empty
              </p>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <img
                      src={item.product.image_urls?.[0] || '/placeholder.svg'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover bg-muted"
                      loading="lazy"
                      width={80}
                      height={80}
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = '/placeholder.svg'
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-serif text-sm">{item.product.name}</h3>
                      <p className="text-xs font-sans text-muted-foreground mt-1">
                        ${item.product.price}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="text-muted-foreground hover:text-foreground">
                          <Minus size={14} />
                        </button>
                        <span className="text-xs font-sans w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="text-muted-foreground hover:text-foreground">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-muted-foreground hover:text-foreground self-start">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-border p-6 space-y-4">
              <div className="flex justify-between text-sm font-sans">
                <span>Subtotal</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="btn-outline-luxury w-full text-center block">
                View Cart
              </Link>
              <Link
                to="/checkout"
                onClick={() => setIsOpen(false)}
                className="btn-luxury w-full text-center block">
                Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
