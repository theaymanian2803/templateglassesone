import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { ExternalLink, LogOut, Package, User as UserIcon } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function Account() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  // Fetch only the orders belonging to the logged-in user
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['my-orders', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(
          `
          *,
          order_items (
            quantity,
            price,
            products (
              id,
              name,
              image_urls
            )
          )
        `
        )
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching account orders:', error)
        throw error
      }
      return data
    },
  })

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Signed out successfully')
      navigate('/')
    }
  }

  if (authLoading)
    return <div className="py-20 text-center text-sm text-muted-foreground">Loading account...</div>
  if (!user) return <Navigate to="/auth" />

  // Extract Google Auth metadata (or fallback)
  const avatarUrl = user.user_metadata?.avatar_url
  const fullName = user.user_metadata?.full_name || 'Valued Customer'
  const email = user.email

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  return (
    <main className="container mx-auto px-4 md:px-8 py-12 max-w-5xl">
      <h1 className="font-serif text-2xl md:text-3xl mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
        {/* --- SIDEBAR: Profile Info --- */}
        <div className="md:col-span-1 space-y-6">
          <div className="border border-border p-6 text-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border border-border"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <UserIcon size={32} className="text-muted-foreground" />
              </div>
            )}
            <h2 className="font-serif text-lg truncate">{fullName}</h2>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleSignOut}
              className="flex items-center justify-between p-4 border border-border hover:bg-muted/30 transition-colors text-sm font-medium text-destructive">
              Sign Out
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* --- MAIN CONTENT: Order History --- */}
        <div className="md:col-span-3">
          <h2 className="font-serif text-xl mb-6 flex items-center gap-2 border-b border-border pb-4">
            <Package size={20} /> Order History
          </h2>

          {ordersLoading ? (
            <p className="text-sm text-muted-foreground py-8">Loading your orders...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 border border-border bg-muted/10">
              <Package size={40} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-sm font-sans mb-4">You haven't placed any orders yet.</p>
              <Link to="/products" className="btn-luxury inline-block text-xs py-2 px-6">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order: any) => (
                <div
                  key={order.id}
                  className="border border-border p-5 md:p-6 hover:border-foreground/20 transition-colors">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground font-mono mb-1">
                        Order #{order.id.split('-')[0]}
                      </p>
                      <p className="text-sm font-medium">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <p className="font-serif text-lg">${order.total}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    {order.order_items.map((item: any, idx: number) => {
                      const product = item.products
                      const productLink = `/product/${product?.id}`
                      // Safely grab the first image from the array using the exact column name
                      const firstImage = product?.image_urls?.[0]

                      return (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-muted border border-border/50 overflow-hidden flex-shrink-0">
                            {firstImage ? (
                              <img
                                src={firstImage}
                                alt={product?.name || 'Product'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={20} className="text-muted-foreground/50" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            {product ? (
                              <Link
                                to={productLink}
                                className="text-sm font-medium hover:underline truncate block">
                                {product.name}
                              </Link>
                            ) : (
                              <p className="text-sm font-medium text-muted-foreground truncate">
                                Product no longer available
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              Qty: {item.quantity} × ${item.price}
                            </p>
                          </div>

                          {product && (
                            <Link
                              to={productLink}
                              className="p-2 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                              title="View Product">
                              <ExternalLink size={16} />
                            </Link>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
