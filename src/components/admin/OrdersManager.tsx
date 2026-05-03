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

  const getStatusColor = (status: string) => {
    if (status === 'delivered') return 'bg-[#d1ebd4] text-[#1e4620] border-[#bce0c0]'
    if (status === 'cancelled') return 'bg-red-50 text-red-700 border-red-100'
    if (status === 'shipped') return 'bg-blue-50 text-blue-700 border-blue-100'
    return 'bg-slate-100 text-slate-700 border-slate-200'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-slate-900">Orders Management</h2>
      </div>

      {isLoading ? (
        <p className="text-xs font-bold tracking-widest uppercase text-slate-400 text-center py-12">
          Loading orders...
        </p>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-[#fcfbf9] border border-[#e5e2db] rounded-sm">
          <p className="text-sm text-slate-500">
            No orders yet or you lack admin view permissions.
          </p>
        </div>
      ) : (
        <>
          {/* --- MOBILE VIEW (Cards stacked) --- */}
          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {orders.map((o: any) => (
              <div
                key={o.id}
                className="bg-[#fcfbf9] border border-[#e5e2db] p-5 rounded-sm shadow-sm flex flex-col gap-4">
                {/* Header: ID, Date, Total */}
                <div className="flex justify-between items-start border-b border-[#e5e2db] pb-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      #{o.id.split('-')[0]}
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {new Date(o.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="font-serif text-xl text-slate-900">${o.total}</p>
                </div>

                {/* Customer Details */}
                <div className="text-sm text-slate-600">
                  <p className="font-medium text-slate-900 mb-0.5">
                    {o.shipping_name || 'No Name Provided'}
                  </p>
                  <p className="text-xs">{o.customer_email || 'No email'}</p>
                  <p className="text-xs">{o.customer_phone || 'No phone'}</p>
                  <p className="text-xs mt-2 text-slate-500">
                    {o.shipping_address || 'No address'}, {o.shipping_city || 'No city'}
                  </p>
                </div>

                {/* Items */}
                <div className="bg-white border border-[#e5e2db] rounded-sm p-3">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                    Items
                  </p>
                  {o.order_items && o.order_items.length > 0 ? (
                    <ul className="space-y-1.5">
                      {o.order_items.map((item: any, idx: number) => (
                        <li key={idx} className="text-xs flex items-start gap-2">
                          <span className="font-bold text-slate-900">{item.quantity}x</span>
                          {item.products?.id ? (
                            <Link
                              to={`/product/${item.products.id}`}
                              className="text-slate-700 hover:text-[#2d6a30] transition-colors leading-tight">
                              {item.products.name}
                            </Link>
                          ) : (
                            <span className="text-slate-500 leading-tight">
                              {item.products?.name || 'Unknown Product'}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-xs italic text-slate-400">No items found</span>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="pt-2 flex items-center justify-between border-t border-[#e5e2db]">
                  {editingId === o.id ? (
                    <form
                      onSubmit={(e) => handleStatusSubmit(e, o.id)}
                      className="flex items-center gap-2 w-full">
                      <select
                        value={statusForm.status}
                        onChange={(e) => setStatusForm({ status: e.target.value })}
                        className="flex-1 bg-white border border-[#e5e2db] px-2 py-2 text-xs rounded-sm focus:outline-none">
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
                        className="px-3 py-2 bg-[#d1ebd4] text-[#1e4620] hover:bg-[#bce0c0] text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors disabled:opacity-50">
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="p-2 text-slate-400 hover:text-slate-900">
                        <X size={16} />
                      </button>
                    </form>
                  ) : (
                    <>
                      <span
                        className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full border ${getStatusColor(o.status)}`}>
                        {o.status.replace('_', ' ')}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingId(o.id)
                            setStatusForm({ status: o.status })
                          }}
                          className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(o.id)}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* --- DESKTOP VIEW (Table) --- */}
          <div className="hidden lg:block bg-[#fcfbf9] border border-[#e5e2db] rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans min-w-[900px]">
                <thead className="bg-slate-50/50 border-b border-[#e5e2db]">
                  <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <th className="py-4 px-5">Order ID</th>
                    <th className="py-4 px-5">Date</th>
                    <th className="py-4 px-5">Customer</th>
                    <th className="py-4 px-5">Shipping</th>
                    <th className="py-4 px-5">Items</th>
                    <th className="py-4 px-5">Total</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e2db]">
                  {orders.map((o: any) => (
                    <tr key={o.id} className="group hover:bg-white/50 transition-colors">
                      <td className="py-4 px-5 font-mono text-xs text-slate-500 align-top">
                        {o.id.split('-')[0]}
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap align-top text-slate-900">
                        {new Date(o.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-5 align-top">
                        <div className="font-medium text-slate-900">{o.shipping_name || '—'}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {o.customer_phone || 'No phone'}
                        </div>
                        <div className="text-xs text-slate-500">
                          {o.customer_email || 'No email'}
                        </div>
                      </td>
                      <td className="py-4 px-5 align-top">
                        <div className="text-sm text-slate-900 max-w-[150px] truncate">
                          {o.shipping_address || '—'}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {o.shipping_city || 'No city'}
                        </div>
                      </td>
                      <td className="py-4 px-5 align-top text-xs text-slate-600">
                        {o.order_items && o.order_items.length > 0 ? (
                          <ul className="space-y-1">
                            {o.order_items.map((item: any, idx: number) => (
                              <li key={idx} className="flex gap-1.5">
                                <span className="font-bold text-slate-900">{item.quantity}x</span>
                                {item.products?.id ? (
                                  <Link
                                    to={`/product/${item.products.id}`}
                                    className="hover:text-[#2d6a30] transition-colors truncate max-w-[150px]">
                                    {item.products.name}
                                  </Link>
                                ) : (
                                  <span className="truncate max-w-[150px]">
                                    {item.products?.name || 'Unknown Product'}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="italic text-slate-400">No items found</span>
                        )}
                      </td>
                      <td className="py-4 px-5 font-serif text-lg text-slate-900 align-top">
                        ${o.total}
                      </td>
                      <td className="py-4 px-5 align-top">
                        {editingId === o.id ? (
                          <form
                            onSubmit={(e) => handleStatusSubmit(e, o.id)}
                            className="flex items-center gap-2">
                            <select
                              value={statusForm.status}
                              onChange={(e) => setStatusForm({ status: e.target.value })}
                              className="bg-white border border-[#e5e2db] py-1.5 px-2 text-xs rounded-sm focus:outline-none w-28"
                              autoFocus>
                              <option value="" disabled>
                                Status
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
                              className="bg-[#d1ebd4] text-[#1e4620] hover:bg-[#bce0c0] px-2 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-sm transition-colors disabled:opacity-50">
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="text-slate-400 hover:text-slate-900 p-1">
                              <X size={14} />
                            </button>
                          </form>
                        ) : (
                          <span
                            className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full border ${getStatusColor(o.status)}`}>
                            {o.status.replace('_', ' ')}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right align-top">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingId(o.id)
                              setStatusForm({ status: o.status })
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors rounded-sm hover:bg-slate-100"
                            title="Edit Status">
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => deleteMutation.mutate(o.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-sm hover:bg-red-50"
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
          </div>
        </>
      )}
    </div>
  )
}
