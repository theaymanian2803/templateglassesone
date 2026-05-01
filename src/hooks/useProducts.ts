import { supabase } from '@/integrations/supabase/client'
import type { Product } from '@/lib/products'
import { useQuery } from '@tanstack/react-query'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Cast as any[] to bypass stale type definitions
      return (data as any[]).map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description || '',
        category: p.category as Product['category'],
        category_id: p.category_id,
        brand_id: p.brand_id,
        frame_shape: p.frame_shape as Product['frame_shape'],
        material: p.material as Product['material'],
        image_urls: p.image_urls?.length ? p.image_urls : ['/placeholder.svg'],
        stock: p.stock,
        specs: {
          lens_width: p.lens_width || '—',
          bridge_width: p.bridge_width || '—',
          temple_length: p.temple_length || '—',
          weight: p.weight || '—',
        },
      })) as Product[]
    },
  })
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['product', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').eq('id', id!).single()

      if (error) throw error

      // Cast as any to bypass stale type definitions
      const p = data as any
      return {
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description || '',
        category: p.category as Product['category'],
        category_id: p.category_id,
        brand_id: p.brand_id,
        frame_shape: p.frame_shape as Product['frame_shape'],
        material: p.material as Product['material'],
        image_urls: p.image_urls?.length ? p.image_urls : ['/placeholder.svg'],
        stock: p.stock,
        specs: {
          lens_width: p.lens_width || '—',
          bridge_width: p.bridge_width || '—',
          temple_length: p.temple_length || '—',
          weight: p.weight || '—',
        },
      } as Product
    },
  })
}
