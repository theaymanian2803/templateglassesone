import productAviator from '@/assets/product-aviator.jpg'
import productBluelight from '@/assets/product-bluelight.jpg'
import productPrescription from '@/assets/product-prescription.jpg'
import productRoundMetal from '@/assets/product-round-metal.jpg'
import productSunglasses from '@/assets/product-sunglasses.jpg'

export interface Product {
  id: string
  name: string
  price: number
  description: string
  category: 'sunglasses' | 'bluelight' | 'prescription'
  frame_shape: 'round' | 'square' | 'aviator'
  material: 'acetate' | 'metal'
  image_urls: string[]
  stock: number
  specs: {
    lens_width: string
    bridge_width: string
    temple_length: string
    weight: string
  }
}

export const products: Product[] = [
  {
    id: '1',
    name: 'The Riviera',
    price: 295,
    description:
      'Classic tortoiseshell round sunglasses with polarized lenses. Hand-crafted Italian acetate for timeless elegance.',
    category: 'sunglasses',
    frame_shape: 'round',
    material: 'acetate',
    image_urls: [productSunglasses],
    stock: 24,
    specs: { lens_width: '50mm', bridge_width: '20mm', temple_length: '145mm', weight: '32g' },
  },
  {
    id: '2',
    name: 'The Scholar',
    price: 245,
    description:
      'Modern blue light blocking glasses with a refined square metal frame. Perfect for long hours of screen time.',
    category: 'bluelight',
    frame_shape: 'square',
    material: 'metal',
    image_urls: [productBluelight],
    stock: 18,
    specs: { lens_width: '52mm', bridge_width: '18mm', temple_length: '140mm', weight: '24g' },
  },
  {
    id: '3',
    name: 'The Heritage',
    price: 325,
    description:
      'Timeless prescription frames with a clubmaster silhouette. Premium acetate and metal construction.',
    category: 'prescription',
    frame_shape: 'round',
    material: 'metal',
    image_urls: [productPrescription],
    stock: 12,
    specs: { lens_width: '49mm', bridge_width: '21mm', temple_length: '145mm', weight: '28g' },
  },
  {
    id: '4',
    name: 'The Voyager',
    price: 315,
    description:
      'Gold-tone aviator sunglasses with gradient lenses. A bold statement piece for the modern traveler.',
    category: 'sunglasses',
    frame_shape: 'aviator',
    material: 'metal',
    image_urls: [productAviator],
    stock: 15,
    specs: { lens_width: '58mm', bridge_width: '14mm', temple_length: '140mm', weight: '26g' },
  },
  {
    id: '5',
    name: 'The Curator',
    price: 275,
    description:
      'Minimalist round silver frames with ultra-thin temples. Lightweight and refined for everyday wear.',
    category: 'prescription',
    frame_shape: 'round',
    material: 'metal',
    image_urls: [productRoundMetal],
    stock: 20,
    specs: { lens_width: '48mm', bridge_width: '19mm', temple_length: '142mm', weight: '18g' },
  },
  {
    id: '6',
    name: 'The Architect',
    price: 285,
    description:
      'Bold aviator prescription frames in brushed gold. Architectural lines meet classic elegance.',
    category: 'prescription',
    frame_shape: 'aviator',
    material: 'metal',
    image_urls: [productAviator],
    stock: 10,
    specs: { lens_width: '55mm', bridge_width: '16mm', temple_length: '140mm', weight: '22g' },
  },
]
