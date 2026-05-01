import ProductCard from '@/components/ProductCard'
import { useProducts } from '@/hooks/useProducts'
import { supabase } from '@/integrations/supabase/client'
import { Product } from '@/lib/products'
import { useQuery } from '@tanstack/react-query'
import { SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function Products() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [brand, setBrand] = useState('all')
  const [shape, setShape] = useState('all')
  const [material, setMaterial] = useState('all')
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Sync category state if the URL changes
  useEffect(() => {
    const urlCategory = searchParams.get('category')
    if (urlCategory) {
      setCategory(urlCategory)
    } else {
      setCategory('all')
    }
  }, [searchParams])

  // Fetch dynamic categories
  const { data: categoriesData = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name')
      if (error) throw error
      return data || []
    },
  })

  // Fetch dynamic brands
  const { data: brandsData = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data, error } = await supabase.from('brands').select('*').order('name')
      if (error) throw error
      return data || []
    },
  })

  const { data: products = [], isLoading } = useProducts()

  // Categories and Brands from Database
  const dynamicCategories = ['all', ...categoriesData.map((c) => c.slug)]
  const dynamicBrands = ['all', ...brandsData.map((b) => b.slug)]

  // Shapes and Materials extracted strictly from the products text columns
  const dynamicShapes = [
    'all',
    ...Array.from(new Set(products.map((p) => p.frame_shape).filter(Boolean))),
  ]
  const dynamicMaterials = [
    'all',
    ...Array.from(new Set(products.map((p) => p.material).filter(Boolean))),
  ]

  // Robust, case-insensitive filtering
  const filtered = useMemo(() => {
    return products.filter((p) => {
      // --- CATEGORY MATCH ---
      if (category && category !== 'all') {
        const searchTarget = category.toLowerCase().trim()
        const catObj = categoriesData.find((c) => c.slug?.toLowerCase() === searchTarget)

        // Match against DB UUID or the legacy text column
        const matchesId = catObj && p.category_id === catObj.id
        const matchesText = String(p.category || '').toLowerCase() === searchTarget

        if (!matchesId && !matchesText) return false
      }

      // --- BRAND MATCH ---
      if (brand && brand !== 'all') {
        const searchTarget = brand.toLowerCase().trim()
        const brandObj = brandsData.find((b) => b.slug?.toLowerCase() === searchTarget)

        const matchesId = brandObj && p.brand_id === brandObj.id
        if (!matchesId) return false
      }

      // --- SHAPE MATCH (Text Column Only) ---
      if (shape && shape !== 'all') {
        const searchTarget = shape.toLowerCase().trim()
        if (String(p.frame_shape || '').toLowerCase() !== searchTarget) return false
      }

      // --- MATERIAL MATCH (Text Column Only) ---
      if (material && material !== 'all') {
        const searchTarget = material.toLowerCase().trim()
        if (String(p.material || '').toLowerCase() !== searchTarget) return false
      }

      // --- SEARCH QUERY MATCH ---
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim()
        const nameMatch = (p.name || '').toLowerCase().includes(q)
        const descMatch = (p.description || '').toLowerCase().includes(q)
        if (!nameMatch && !descMatch) return false
      }

      return true
    })
  }, [category, brand, shape, material, searchQuery, products, categoriesData, brandsData])

  const clearFilters = () => {
    setCategory('all')
    setBrand('all')
    setShape('all')
    setMaterial('all')
  }

  const hasFilters = category !== 'all' || brand !== 'all' || shape !== 'all' || material !== 'all'

  // Display Name Helpers
  const getCategoryDisplayName = (slug: string) => {
    if (slug === 'all') return 'All'
    const cat = categoriesData.find((c) => c.slug === slug)
    return cat ? cat.name : slug
  }

  const getBrandDisplayName = (slug: string) => {
    if (slug === 'all') return 'All'
    const item = brandsData.find((b) => b.slug === slug)
    return item ? item.name : slug
  }

  const getShapeDisplayName = (slug: string) => (slug === 'all' ? 'All' : slug)
  const getMaterialDisplayName = (slug: string) => (slug === 'all' ? 'All' : slug)

  const FilterChips = ({
    label,
    options,
    value,
    onChange,
    getDisplayValue,
  }: {
    label: string
    options: readonly string[] | string[]
    value: string
    onChange: (v: string) => void
    getDisplayValue?: (val: string) => string
  }) => (
    <div>
      <p className="text-xs font-sans tracking-widest uppercase text-muted-foreground mb-3">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 text-xs font-sans capitalize transition-all border ${value === opt ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent text-foreground border-border hover:border-foreground'}`}>
            {getDisplayValue ? getDisplayValue(opt) : opt === 'bluelight' ? 'Blue Light' : opt}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <main className="container mx-auto px-4 md:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-heading text-2xl md:text-3xl">
            {searchQuery ? `Results for "${searchQuery}"` : 'All Frames'}
          </h1>
          <p className="text-sm font-sans text-muted-foreground mt-1">{filtered.length} styles</p>
        </div>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors md:hidden">
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="flex gap-12">
        <aside className="hidden md:block w-56 shrink-0 space-y-8">
          {dynamicCategories.length > 1 && (
            <FilterChips
              label="Category"
              options={dynamicCategories}
              value={category}
              onChange={setCategory}
              getDisplayValue={getCategoryDisplayName}
            />
          )}
          {dynamicBrands.length > 1 && (
            <FilterChips
              label="Brand"
              options={dynamicBrands}
              value={brand}
              onChange={setBrand}
              getDisplayValue={getBrandDisplayName}
            />
          )}
          {dynamicShapes.length > 1 && (
            <FilterChips
              label="Frame Shape"
              options={dynamicShapes}
              value={shape}
              onChange={setShape}
              getDisplayValue={getShapeDisplayName}
            />
          )}
          {dynamicMaterials.length > 1 && (
            <FilterChips
              label="Material"
              options={dynamicMaterials}
              value={material}
              onChange={setMaterial}
              getDisplayValue={getMaterialDisplayName}
            />
          )}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-sans text-muted-foreground hover:text-foreground flex items-center gap-1">
              <X size={12} /> Clear filters
            </button>
          )}
        </aside>

        {filtersOpen && (
          <div className="fixed inset-0 z-40 bg-background p-6 overflow-y-auto md:hidden animate-fade-up">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-serif text-lg">Filters</h2>
              <button onClick={() => setFiltersOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="space-y-8">
              {dynamicCategories.length > 1 && (
                <FilterChips
                  label="Category"
                  options={dynamicCategories}
                  value={category}
                  onChange={setCategory}
                  getDisplayValue={getCategoryDisplayName}
                />
              )}
              {dynamicBrands.length > 1 && (
                <FilterChips
                  label="Brand"
                  options={dynamicBrands}
                  value={brand}
                  onChange={setBrand}
                  getDisplayValue={getBrandDisplayName}
                />
              )}
              {dynamicShapes.length > 1 && (
                <FilterChips
                  label="Frame Shape"
                  options={dynamicShapes}
                  value={shape}
                  onChange={setShape}
                  getDisplayValue={getShapeDisplayName}
                />
              )}
              {dynamicMaterials.length > 1 && (
                <FilterChips
                  label="Material"
                  options={dynamicMaterials}
                  value={material}
                  onChange={setMaterial}
                  getDisplayValue={getMaterialDisplayName}
                />
              )}
            </div>
            <button onClick={() => setFiltersOpen(false)} className="btn-luxury w-full mt-8">
              Show {filtered.length} results
            </button>
          </div>
        )}

        <div className="flex-1">
          {isLoading ? (
            <p className="text-sm font-sans text-muted-foreground text-center py-16">
              Loading products...
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-sm font-sans text-muted-foreground text-center py-16">
              No frames found. Try adjusting your filters.
            </p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product as Product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
