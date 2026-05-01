import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { supabase } from '@/integrations/supabase/client'
import { Check, Package, User } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

const steps = ['Information', 'Review & Place Order']

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()

  const [currentStep, setCurrentStep] = useState(0)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [guestCheckout, setGuestCheckout] = useState(false)

  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
  })

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }))

  // --- EMPTY CART VIEW ---
  if (items.length === 0 && !orderPlaced) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-2xl mb-4">Your cart is empty</h1>
        <Link to="/products" className="btn-outline-luxury">
          Continue Shopping
        </Link>
      </main>
    )
  }

  // --- SUCCESS VIEW ---
  if (orderPlaced) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
          <Check size={28} className="text-primary-foreground" />
        </div>
        <h1 className="font-serif text-3xl mb-2">Thank You</h1>
        <p className="text-sm font-sans text-muted-foreground mb-2">
          Your order has been placed successfully.
        </p>
        <p className="text-sm font-sans text-muted-foreground mb-8">
          Payment will be collected upon delivery (Cash on Delivery).
        </p>
        <Link to="/" className="btn-outline-luxury">
          Back to Home
        </Link>
      </main>
    )
  }

  // --- AUTHENTICATION GATEWAY ---
  if (!user && !guestCheckout) {
    return (
      <main className="container mx-auto px-4 py-20 max-w-md text-center animate-fade-up">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <User size={28} className="text-muted-foreground" />
        </div>
        <h1 className="font-serif text-2xl mb-8">How would you like to checkout?</h1>

        <div className="space-y-4">
          <Link to="/auth" className="btn-luxury w-full block py-3 text-center">
            Log In or Sign Up
          </Link>

          <div className="relative border-b border-border my-8">
            <span className="absolute left-1/2 -top-3 -translate-x-1/2 bg-background px-4 text-xs tracking-widest text-muted-foreground uppercase">
              Or
            </span>
          </div>

          <button onClick={() => setGuestCheckout(true)} className="btn-outline-luxury w-full py-3">
            Continue as Guest
          </button>
        </div>

        <p className="text-xs text-muted-foreground mt-8">
          Creating an account allows you to track your orders and checkout faster next time.
        </p>
      </main>
    )
  }

  // --- MAIN CHECKOUT LOGIC ---
  const validateForm = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error('Please enter your name.')
      return false
    }
    if (!form.email.trim() && !form.phone.trim()) {
      toast.error('Please enter an email or phone number.')
      return false
    }
    if (!form.address.trim() || !form.city.trim()) {
      toast.error('Please complete the shipping address.')
      return false
    }
    return true
  }

  const handlePlaceOrder = async () => {
    setPlacing(true)
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          total,
          status: 'pending_cod',
          shipping_name: `${form.firstName} ${form.lastName}`,
          shipping_address: form.address,
          shipping_city: form.city,
          customer_email: form.email || null,
          customer_phone: form.phone || null,
        })
        .select()
        .single()

      if (orderError) throw orderError

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        prescription_type: item.prescription_type || null,
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

      if (itemsError) throw itemsError

      clearCart()
      setOrderPlaced(true)
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  const inputClass =
    'w-full bg-transparent border border-border px-4 py-3 text-sm font-sans focus:outline-none focus:border-foreground transition-colors'

  return (
    <main className="container mx-auto px-4 md:px-8 py-12 max-w-4xl animate-fade-up">
      <h1 className="font-serif text-2xl md:text-3xl mb-8">Checkout</h1>

      <div className="flex items-center gap-4 mb-12">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-sans ${i <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {i < currentStep ? <Check size={14} /> : i + 1}
            </div>
            <span
              className={`text-xs font-sans hidden sm:block ${i <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
              {step}
            </span>
            {i < steps.length - 1 && (
              <div className={`w-8 h-px ${i < currentStep ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
        <div className="md:col-span-3 space-y-6">
          {currentStep === 0 && (
            <>
              <h2 className="font-serif text-lg">Contact & Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="First name *"
                  value={form.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                  className={inputClass}
                />
                <input
                  placeholder="Last name *"
                  value={form.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  className={inputClass}
                />
              </div>
              <input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className={inputClass}
              />
              <input
                placeholder="Phone"
                type="text"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className={inputClass}
              />
              <input
                placeholder="Address *"
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                className={inputClass}
              />
              <input
                placeholder="City *"
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                className={inputClass}
              />
            </>
          )}

          {currentStep === 1 && (
            <>
              <h2 className="font-serif text-lg">Cash on Delivery</h2>
              <div className="flex items-center gap-3 p-4 border border-primary">
                <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div>
                  <span className="text-sm font-sans font-medium">Cash on Delivery</span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Pay when your order arrives
                  </p>
                </div>
              </div>
              <div className="bg-muted/50 border border-border p-4 text-xs font-sans text-muted-foreground space-y-1">
                <p className="font-medium text-foreground text-sm mb-2">How it works</p>
                <p>• Your order will be prepared and shipped to the address provided.</p>
                <p>• Pay the delivery person the full order amount upon receipt.</p>
                <p>• Cash and card payments accepted at the door.</p>
              </div>

              <div className="bg-muted/30 border border-border p-4 text-xs font-sans space-y-1 mt-4">
                <p className="font-medium text-foreground text-sm mb-2">Shipping to</p>
                <p>
                  {form.firstName} {form.lastName}
                </p>
                <p>{form.address}</p>
                <p>{form.city}</p>
                {form.email && <p>{form.email}</p>}
                {form.phone && <p>{form.phone}</p>}
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            {currentStep > 0 && (
              <button onClick={() => setCurrentStep(0)} className="btn-outline-luxury">
                Back
              </button>
            )}
            {currentStep === 0 ? (
              <button
                onClick={() => {
                  if (validateForm()) setCurrentStep(1)
                }}
                className="btn-luxury flex-1">
                Continue
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="btn-luxury flex-1 disabled:opacity-50">
                {placing ? 'Placing Order...' : 'Place Order — Cash on Delivery'}
              </button>
            )}
          </div>

          {!user && (
            <p className="text-xs text-muted-foreground text-center pt-4">
              Checking out as guest.{' '}
              <Link to="/auth" className="underline hover:text-foreground">
                Sign in
              </Link>{' '}
              to track your orders.
            </p>
          )}
        </div>

        {/* Order summary */}
        <div className="md:col-span-2">
          <div className="bg-muted p-6 sticky top-24">
            <h3 className="font-serif text-sm mb-4">Order Summary</h3>
            <div className="space-y-3">
              {items.map((item) => {
                // Ensure we are using image_urls as defined in the schema
                const firstImage = item.product.image_urls?.[0]

                return (
                  <div key={item.product.id} className="flex gap-3">
                    {firstImage ? (
                      <img
                        src={firstImage}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover border border-border"
                        loading="lazy"
                        width={48}
                        height={48}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-background border border-border flex items-center justify-center text-muted-foreground">
                        <Package size={16} />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-xs font-sans font-medium">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-sans">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-border mt-6 pt-4 space-y-2">
              <div className="flex justify-between text-xs font-sans">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-sans">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-xs font-sans">
                <span className="text-muted-foreground">Payment</span>
                <span>Cash on Delivery</span>
              </div>
              <div className="flex justify-between text-sm font-sans font-medium pt-4 mt-2 border-t border-border">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
