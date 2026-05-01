import { supabase } from '@/integrations/supabase/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Edit2, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

const STATUS_OPTIONS = ['pending', 'pending_cod', 'processing', 'shipped', 'delivered', 'cancelled']

export default function OrdersManager() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [statusForm, setStatusForm] = useState({ status: '' })

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(
          `
          *,
          order_items (
            quantity,
            products (
              id,
              name
            )
          )
        `
        )
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching orders:', error)
        throw error
      }
      return data
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status: status.trim() })
        .eq('id', id)
        .select()

      if (error) throw error
      if (!data || data.length === 0) {
        throw new Error('Update failed. You may not have admin update permissions.')
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      toast.success('Order status updated')
      setEditingId(null)
    },
    onError: (err: any) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('orders').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      toast.success('Order deleted')
    },
    onError: (err: any) => toast.error(err.message),
  })

  const handleStatusSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault()
    if (!statusForm.status.trim()) {
      toast.error('Status cannot be empty')
      return
    }
    updateMutation.mutate({ id, status: statusForm.status })
  }

  const inputClass =
    'w-full bg-transparent border border-border px-3 py-2 text-sm font-sans focus:outline-none focus:border-foreground transition-colors'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl">Orders</h2>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground text-center py-8">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No orders yet or you lack admin view permissions.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 font-medium text-muted-foreground">Order ID</th>
                <th className="pb-3 font-medium text-muted-foreground">Date</th>
                <th className="pb-3 font-medium text-muted-foreground">Customer</th>
                <th className="pb-3 font-medium text-muted-foreground">Shipping Address</th>
                <th className="pb-3 font-medium text-muted-foreground">Items</th>
                <th className="pb-3 font-medium text-muted-foreground">Total</th>
                <th className="pb-3 font-medium text-muted-foreground">Status</th>
                <th className="pb-3 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((o: any) => (
                <tr key={o.id} className="group hover:bg-muted/30 transition-colors">
                  <td className="py-4 font-mono text-xs text-muted-foreground align-top">
                    {o.id.split('-')[0]}...
                  </td>
                  <td className="py-4 whitespace-nowrap align-top">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 align-top">
                    <div className="font-medium">{o.shipping_name || '—'}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {o.customer_phone || 'No phone'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {o.customer_email || 'No email'}
                    </div>
                  </td>
                  <td className="py-4 align-top">
                    <div className="text-sm">{o.shipping_address || '—'}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {o.shipping_city || 'No city'}
                    </div>
                  </td>
                  <td className="py-4 align-top text-xs text-muted-foreground">
                    {o.order_items && o.order_items.length > 0 ? (
                      <ul className="space-y-1">
                        {o.order_items.map((item: any, idx: number) => (
                          <li key={idx}>
                            <span className="font-medium text-foreground">{item.quantity}x</span>{' '}
                            {item.products?.id ? (
                              <Link
                                to={`/product/${item.products.id}`}
                                className="hover:text-foreground underline underline-offset-2 transition-colors">
                                {item.products.name}
                              </Link>
                            ) : (
                              item.products?.name || 'Unknown Product'
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="italic">No items found</span>
                    )}
                  </td>
                  <td className="py-4 font-medium align-top">${o.total}</td>
                  <td className="py-4 align-top">
                    {editingId === o.id ? (
                      <form
                        onSubmit={(e) => handleStatusSubmit(e, o.id)}
                        className="flex items-center gap-2">
                        <select
                          value={statusForm.status}
                          onChange={(e) => setStatusForm({ status: e.target.value })}
                          className={`${inputClass} py-1 px-2 w-32 cursor-pointer`}
                          autoFocus>
                          <option value="" disabled>
                            Select status
                          </option>
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status.replace('_', ' ').toUpperCase()}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          disabled={updateMutation.isPending}
                          className="text-xs font-medium hover:text-foreground">
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-muted-foreground hover:text-foreground">
                          <X size={14} />
                        </button>
                      </form>
                    ) : (
                      <span className="px-2.5 py-1 bg-border/50 rounded-full text-xs font-medium inline-block">
                        {o.status.replace('_', ' ').toUpperCase()}
                      </span>
                    )}
                  </td>
                  <td className="py-4 text-right align-top">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingId(o.id)
                          setStatusForm({ status: o.status })
                        }}
                        className="p-1.5 hover:text-foreground text-muted-foreground"
                        title="Edit Status">
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(o.id)}
                        className="p-1.5 hover:text-destructive text-muted-foreground"
                        title="Delete Order">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
