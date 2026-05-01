import BrandsManager from '@/components/admin/BrandsManager'
import CategoriesManager from '@/components/admin/CategoriesManager'
import OrdersManager from '@/components/admin/OrdersManager'
import ProductImageUpload from '@/components/admin/ProductImageUpload'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Edit2, Plus, Shield, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'

// Using these as suggestions now, allowing custom typing in the form
const SHAPES = ['round', 'square', 'aviator', 'cat-eye', 'rectangle', 'oval', 'geometric']
const MATERIALS = ['acetate', 'metal', 'titanium', 'tr90', 'mixed']
const LEGACY_CATEGORIES = ['sunglasses', 'bluelight', 'prescription']

const TABS = ['Products', 'Categories', 'Brands', 'Orders'] as const

const emptyForm = {
  name: '',
  price: '',
  description: '',
  category: 'sunglasses',
  frame_shape: 'round',
  material: 'acetate',
  image_urls: [] as string[],
  stock: '0',
  lens_width: '',
  bridge_width: '',
  temple_length: '',
  weight: '',
  brand_id: '',
  category_id: '',
}

export default function Admin() {
  const { user, loading: authLoading } = useAuth()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('Products')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const { data: isAdmin, isLoading: roleLoading } = useQuery({
    queryKey: ['isAdmin', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user!.id)
        .eq('role', 'admin')
        .maybeSingle()
      return !!data
    },
  })

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    enabled: isAdmin === true,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, brands(name), categories(name)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    enabled: isAdmin === true,
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name')
      if (error) throw error
      return data
    },
  })

  const { data: brands = [] } = useQuery({
    queryKey: ['admin-brands'],
    enabled: isAdmin === true,
    queryFn: async () => {
      const { data, error } = await supabase.from('brands').select('*').order('name')
      if (error) throw error
      return data
    },
  })

  const addMutation = useMutation({
    mutationFn: async (product: typeof form) => {
      const payload: any = {
        name: product.name.trim(),
        price: parseFloat(product.price),
        description: product.description.trim() || null,
        category: product.category.trim() || 'uncategorized',
        frame_shape: product.frame_shape.trim() || 'unspecified',
        material: product.material.trim() || 'unspecified',
        image_urls: product.image_urls.filter((url) => url.trim() !== ''),
        stock: parseInt(product.stock) || 0,
        lens_width: product.lens_width.trim() || null,
        bridge_width: product.bridge_width.trim() || null,
        temple_length: product.temple_length.trim() || null,
        weight: product.weight.trim() || null,
        brand_id: product.brand_id || null,
        category_id: product.category_id || null,
      }
      if (editingId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('products').insert(payload)
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success(editingId ? 'Product updated' : 'Product added')
      resetForm()
    },
    onError: (err: any) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product deleted')
    },
    onError: (err: any) => toast.error(err.message),
  })

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  const startEdit = (p: any) => {
    setForm({
      name: p.name,
      price: String(p.price),
      description: p.description || '',
      category: p.category,
      frame_shape: p.frame_shape,
      material: p.material,
      image_urls: p.image_urls || [],
      stock: String(p.stock),
      lens_width: p.lens_width || '',
      bridge_width: p.bridge_width || '',
      temple_length: p.temple_length || '',
      weight: p.weight || '',
      brand_id: p.brand_id || '',
      category_id: p.category_id || '',
    })
    setEditingId(p.id)
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.price) {
      toast.error('Name and price are required')
      return
    }
    addMutation.mutate(form)
  }

  const update = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }))

  if (authLoading)
    return (
      <main className="container mx-auto px-4 py-20 text-center min-h-[calc(100vh-24rem)] flex-grow">
        <p className="text-sm font-sans text-muted-foreground">Loading...</p>
      </main>
    )
  if (!user) return <Navigate to="/auth" />
  if (roleLoading)
    return (
      <main className="container mx-auto px-4 py-20 text-center min-h-[calc(100vh-24rem)] flex-grow">
        <p className="text-sm font-sans text-muted-foreground">Checking permissions...</p>
      </main>
    )
  if (!isAdmin)
    return (
      <main className="container mx-auto px-4 py-20 text-center min-h-[calc(100vh-24rem)] flex-grow">
        <Shield size={48} className="text-muted-foreground mx-auto mb-4" />
        <h1 className="font-serif text-2xl mb-2">Access Denied</h1>
        <p className="text-sm font-sans text-muted-foreground">You don't have admin privileges.</p>
      </main>
    )

  const inputClass =
    'w-full bg-transparent border border-border px-3 py-2 text-sm font-sans focus:outline-none focus:border-foreground transition-colors'

  return (
    <main className="container mx-auto px-4 md:px-8 py-12 max-w-5xl min-h-[calc(100vh-24rem)] flex-grow">
      <h1 className="font-serif text-2xl md:text-3xl mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto overflow-y-hidden">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-sans transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === tab ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Categories' && <CategoriesManager />}
      {activeTab === 'Brands' && <BrandsManager />}
      {activeTab === 'Orders' && <OrdersManager />}

      {activeTab === 'Products' && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl">Products</h2>
            <button
              onClick={() => {
                resetForm()
                setShowForm(!showForm)
              }}
              className="btn-luxury flex items-center gap-2 text-sm">
              {showForm ? (
                <>
                  <X size={16} /> Cancel
                </>
              ) : (
                <>
                  <Plus size={16} /> Add Product
                </>
              )}
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="border border-border p-6 mb-8 space-y-4 bg-background">
              <h3 className="font-serif text-lg">{editingId ? 'Edit Product' : 'New Product'}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Product name *"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  className={inputClass}
                  required
                />
                <input
                  placeholder="Price *"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => update('price', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                className={inputClass + ' min-h-[80px] resize-y'}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-sans text-muted-foreground mb-1 block">
                    Category (Relational)
                  </label>
                  <select
                    value={form.category_id}
                    onChange={(e) => update('category_id', e.target.value)}
                    className={inputClass}>
                    <option value="">— Select category —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-sans text-muted-foreground mb-1 block">
                    Brand
                  </label>
                  <select
                    value={form.brand_id}
                    onChange={(e) => update('brand_id', e.target.value)}
                    className={inputClass}>
                    <option value="">— Select brand —</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-sans text-muted-foreground mb-1 block">
                    Legacy Category
                  </label>
                  <input
                    list="legacy-categories"
                    placeholder="Select or type category..."
                    value={form.category}
                    onChange={(e) => update('category', e.target.value)}
                    className={inputClass}
                  />
                  <datalist id="legacy-categories">
                    {LEGACY_CATEGORIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="text-xs font-sans text-muted-foreground mb-1 block">
                    Frame Shape
                  </label>
                  <input
                    list="shapes-list"
                    placeholder="Select or type shape..."
                    value={form.frame_shape}
                    onChange={(e) => update('frame_shape', e.target.value)}
                    className={inputClass}
                  />
                  <datalist id="shapes-list">
                    {SHAPES.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="text-xs font-sans text-muted-foreground mb-1 block">
                    Material
                  </label>
                  <input
                    list="materials-list"
                    placeholder="Select or type material..."
                    value={form.material}
                    onChange={(e) => update('material', e.target.value)}
                    className={inputClass}
                  />
                  <datalist id="materials-list">
                    {MATERIALS.map((m) => (
                      <option key={m} value={m} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2 space-y-4">
                  <label className="text-xs font-sans text-muted-foreground block">
                    Product Images
                  </label>
                  {form.image_urls.map((url, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-grow">
                        <ProductImageUpload
                          imageUrl={url}
                          onImageChange={(newUrl) => {
                            const newUrls = [...form.image_urls]
                            newUrls[index] = newUrl
                            update('image_urls', newUrls)
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newUrls = form.image_urls.filter((_, i) => i !== index)
                          update('image_urls', newUrls)
                        }}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors mt-8">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => update('image_urls', [...form.image_urls, ''])}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <Plus size={16} /> Add Image
                  </button>
                </div>
                <div>
                  <label className="text-xs font-sans text-muted-foreground mb-1 block">
                    Stock
                  </label>
                  <input
                    placeholder="Stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => update('stock', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <input
                  placeholder="Lens width"
                  value={form.lens_width}
                  onChange={(e) => update('lens_width', e.target.value)}
                  className={inputClass}
                />
                <input
                  placeholder="Bridge width"
                  value={form.bridge_width}
                  onChange={(e) => update('bridge_width', e.target.value)}
                  className={inputClass}
                />
                <input
                  placeholder="Temple length"
                  value={form.temple_length}
                  onChange={(e) => update('temple_length', e.target.value)}
                  className={inputClass}
                />
                <input
                  placeholder="Weight"
                  value={form.weight}
                  onChange={(e) => update('weight', e.target.value)}
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={addMutation.isPending}
                className="btn-luxury disabled:opacity-50">
                {addMutation.isPending ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          )}

          {isLoading ? (
            <p className="text-sm font-sans text-muted-foreground text-center py-12">
              Loading products...
            </p>
          ) : products.length === 0 ? (
            <p className="text-sm font-sans text-muted-foreground text-center py-12">
              No products yet.
            </p>
          ) : (
            <div className="rounded-lg border border-border bg-background shadow-sm overflow-hidden">
              <div className="overflow-x-auto overflow-y-hidden">
                <table className="w-full text-sm font-sans min-w-[500px]">
                  <thead className="bg-muted/30">
                    <tr className="border-b border-border text-left">
                      <th className="py-4 px-4 font-medium text-muted-foreground whitespace-nowrap">
                        Product
                      </th>
                      <th className="py-4 px-4 font-medium text-muted-foreground whitespace-nowrap">
                        Brand
                      </th>
                      <th className="py-4 px-4 font-medium text-muted-foreground whitespace-nowrap">
                        Price
                      </th>
                      <th className="py-4 px-4 font-medium text-muted-foreground whitespace-nowrap">
                        Stock
                      </th>
                      <th className="py-4 px-4 font-medium text-muted-foreground text-right whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products.map((p: any) => (
                      <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {p.image_urls && p.image_urls.length > 0 && (
                              <img
                                src={p.image_urls[0]}
                                alt={p.name}
                                className="w-10 h-10 object-cover rounded border border-border"
                              />
                            )}
                            <span className="font-medium whitespace-nowrap">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{p.brands?.name || '—'}</td>
                        <td className="py-3 px-4 font-medium">${p.price}</td>
                        <td className="py-3 px-4 text-muted-foreground">{p.stock}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => startEdit(p)}
                              className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              title="Edit">
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => deleteMutation.mutate(p.id)}
                              className="p-2 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                              title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  )
}
