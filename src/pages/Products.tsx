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
    <div className="mb-8">
      <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#1a2b3c]/50 mb-3">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-4 py-2 text-xs font-sans font-medium capitalize transition-all rounded-full border ${
              value === opt
                ? 'bg-[#1a2b3c] text-white border-[#1a2b3c] shadow-sm'
                : 'bg-white/60 text-[#1a2b3c] border-[#1a2b3c]/15 hover:bg-white hover:border-[#1a2b3c]/30'
            }`}>
            {getDisplayValue ? getDisplayValue(opt) : opt === 'bluelight' ? 'Blue Light' : opt}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <main className="w-full  min-h-screen bg-background text-[#1a2b3c] font-sans pb-24 selection:bg-[#1a2b3c] selection:text-white mt-12">
      <div className="container mx-auto px-4 md:px-8 py-12 lg:py-20 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#1a2b3c]/10 pb-8">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1a2b3c] leading-[1.1] tracking-tight">
              {searchQuery ? `Results for "${searchQuery}"` : 'All Frames'}
            </h1>
            <p className="text-base font-sans text-[#1a2b3c]/60 mt-4 font-light">
              Explore our curated selection of {filtered.length} styles.
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-[#1a2b3c]/15 rounded-full text-xs font-sans tracking-widest uppercase text-[#1a2b3c] hover:border-[#1a2b3c]/30 hover:bg-[#f8f9fa] transition-all shadow-sm md:hidden">
            <SlidersHorizontal size={16} /> Customize Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24">
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
                  className="mt-4 px-4 py-2 text-xs font-sans font-semibold tracking-widest uppercase text-[#1a2b3c]/60 hover:text-[#1a2b3c] flex items-center gap-2 transition-colors border border-transparent hover:border-[#1a2b3c]/10 rounded-full">
                  <X size={14} /> Clear filters
                </button>
              )}
            </div>
          </aside>

          {/* Mobile Filters Modal */}
          {filtersOpen && (
            <div className="fixed inset-0 z-50 bg-[#dbeebcef] p-6 overflow-y-auto md:hidden animate-in slide-in-from-bottom-full duration-300">
              <div
                className="bg-white min-h-full p-6 relative border border-[#1a2b3c]/10 shadow-xl"
                style={{
                  clipPath:
                    'polygon(20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%, 0% 20px)',
                }}>
                <div className="flex justify-between items-center mb-10 pb-4 border-b border-[#1a2b3c]/10">
                  <h2 className="font-serif text-2xl text-[#1a2b3c]">Filters</h2>
                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="w-10 h-10 rounded-full border border-[#1a2b3c]/10 flex items-center justify-center text-[#1a2b3c] hover:bg-[#1a2b3c] hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
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

                <div className="mt-12 space-y-3">
                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="w-full bg-[#1a2b3c] text-white py-4 rounded-full text-sm font-sans font-semibold tracking-widest uppercase hover:bg-[#2a3b4c] transition-all">
                    Show {filtered.length} results
                  </button>
                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                      className="w-full bg-white text-[#1a2b3c] border border-[#1a2b3c]/20 py-4 rounded-full text-sm font-sans font-semibold tracking-widest uppercase hover:bg-[#f8f9fa] transition-all">
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="w-full h-64 flex flex-col items-center justify-center">
                <p className="text-sm font-sans tracking-widest uppercase text-[#1a2b3c]/50">
                  Curating styles...
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="w-full h-64 flex flex-col items-center justify-center border border-dashed border-[#1a2b3c]/20 bg-white/30 p-8 text-center">
                <p className="text-lg font-serif text-[#1a2b3c] mb-2">No frames found.</p>
                <p className="text-sm font-sans text-[#1a2b3c]/60 font-light">
                  Try adjusting your filters or search query to find the perfect pair.
                </p>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-6 px-6 py-2.5 bg-white border border-[#1a2b3c]/15 rounded-full text-xs font-sans tracking-widest uppercase text-[#1a2b3c] hover:border-[#1a2b3c]/30 hover:bg-[#f8f9fa] transition-all shadow-sm">
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product as Product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
