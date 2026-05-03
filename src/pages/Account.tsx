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
    return (
      <div className="py-32 text-center text-sm font-sans tracking-widest uppercase text-slate-500">
        Loading account...
      </div>
    )
  if (!user) return <Navigate to="/auth" />

  // Extract Google Auth metadata (or fallback)
  const avatarUrl = user.user_metadata?.avatar_url
  const fullName = user.user_metadata?.full_name || 'Valued Customer'
  const email = user.email

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100'
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-100'
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-100'
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200'
    }
  }

  return (
    // Added pt-32 md:pt-40 to push content below the absolute header
    <main className="container mx-auto px-6 md:px-12 pt-32 pb-24 md:pt-40 max-w-6xl min-h-screen font-sans">
      <h1 className="font-serif text-3xl md:text-5xl mb-12 text-slate-900 tracking-tight">
        My Account
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
        {/* --- SIDEBAR: Profile Info --- */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-[24px] p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-24 h-24 rounded-full mx-auto mb-5 object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-5 border-2 border-white shadow-sm">
                <UserIcon size={36} className="text-slate-400" />
              </div>
            )}
            <h2 className="font-serif text-xl text-slate-900 mb-1 truncate">{fullName}</h2>
            <p className="text-xs text-slate-500 truncate">{email}</p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-between p-5 bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-[16px] hover:bg-red-50 hover:border-red-100 hover:text-red-600 transition-colors text-sm font-medium text-slate-600 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
              Sign Out
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* --- MAIN CONTENT: Order History --- */}
        <div className="md:col-span-3">
          <h2 className="font-serif text-2xl mb-8 flex items-center gap-3 text-slate-900">
            <Package size={24} className="text-[#f472b6]" /> Order History
          </h2>

          {ordersLoading ? (
            <p className="text-sm text-slate-500 py-8 tracking-widest uppercase">
              Loading your orders...
            </p>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white/40 backdrop-blur-sm border border-slate-200/60 rounded-[24px]">
              <Package size={48} className="mx-auto text-slate-300 mb-5" strokeWidth={1} />
              <p className="text-slate-600 mb-6">You haven't placed any orders yet.</p>
              <Link
                to="/products"
                className="inline-block px-8 py-3 bg-[#111827] text-white rounded-full text-xs font-bold tracking-widest uppercase hover:bg-black transition-colors">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order: any) => (
                <div
                  key={order.id}
                  className="bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-[24px] p-6 md:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5 mb-5">
                    <div>
                      <p className="text-[11px] text-slate-500 font-bold tracking-[0.15em] uppercase mb-1.5">
                        Order #{order.id.split('-')[0]}
                      </p>
                      <p className="text-sm text-slate-900 font-medium">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-5">
                      <span
                        className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-widest border ${getStatusColor(
                          order.status
                        )}`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <p className="font-serif text-xl text-slate-900">${order.total}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-5">
                    {order.order_items.map((item: any, idx: number) => {
                      const product = item.products
                      const productLink = `/product/${product?.id}`
                      const firstImage = product?.image_urls?.[0]

                      return (
                        <div key={idx} className="flex items-center gap-5">
                          <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
                            {firstImage ? (
                              <img
                                src={firstImage}
                                alt={product?.name || 'Product'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={24} className="text-slate-300" strokeWidth={1} />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            {product ? (
                              <Link
                                to={productLink}
                                className="text-base font-medium text-slate-900 hover:text-[#f472b6] transition-colors truncate block">
                                {product.name}
                              </Link>
                            ) : (
                              <p className="text-base font-medium text-slate-400 truncate">
                                Product no longer available
                              </p>
                            )}
                            <p className="text-sm text-slate-500 mt-1">
                              Qty: {item.quantity} × ${item.price}
                            </p>
                          </div>

                          {product && (
                            <Link
                              to={productLink}
                              className="p-3 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0"
                              title="View Product">
                              <ExternalLink size={18} strokeWidth={1.5} />
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
