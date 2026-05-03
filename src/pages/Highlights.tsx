import { motion, useScroll, useTransform } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useRef } from 'react'

// Template data - high quality Unsplash placeholders & generic text
const galleryItems = [
  {
    id: '01',
    src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    height: 'h-[450px]',
    tag: 'Vestibulum',
  },
  {
    id: '02',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    height: 'h-[350px]',
    tag: 'Aenean',
  },
  {
    id: '03',
    src: 'https://images.unsplash.com/photo-1550614000-4b95dd24cbcc?q=80&w=800&auto=format&fit=crop',
    height: 'h-[550px]',
    tag: 'Nullam',
  },
  {
    id: '04',
    src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop',
    height: 'h-[400px]',
    tag: 'Curabitur',
  },
  {
    id: '05',
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
    height: 'h-[500px]',
    tag: 'Donec',
  },
  {
    id: '06',
    src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
    height: 'h-[350px]',
    tag: 'Maecenas',
  },
  {
    id: '07',
    src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop',
    height: 'h-[450px]',
    tag: 'Pellentesque',
  },
  {
    id: '08',
    src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop',
    height: 'h-[400px]',
    tag: 'Cras Justo',
  },
  {
    id: '09',
    src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    height: 'h-[400px]',
    tag: 'Fringilla',
  },
]

// Individual framed card component with editorial styling & parallax
const GalleryCard = ({ item, index }) => {
  const ref = useRef(null)

  // Creates a subtle parallax scroll effect for each image container
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // The image inside will slowly translate on the Y axis as you scroll
  const imageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <div className="bg-gradient-to-br from-[#e8edf248] to-[#c5f1c060] ">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: (index % 3) * 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="break-inside-avoid relative bg-white p-3 md:p-4 border border-[#1a2b3c]/10 mb-6 md:mb-8 group shadow-sm hover:shadow-md transition-shadow">
        {/* Image Container with Parallax Overflow Hidden */}
        <div className={`relative overflow-hidden w-full ${item.height} bg-[#f0f3f8]`}>
          <motion.img
            style={{ y: imageY }}
            src={item.src}
            alt={`Gallery item ${item.id}`}
            className="absolute inset-0 w-full h-[116%] object-cover object-center -top-[8%] grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
            loading="lazy"
          />

          {/* Minimalist Overlay that appears on hover */}
          <div className="absolute inset-0 bg-[#1a2b3c]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-4">
            <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#1a2b3c] transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
              <Plus size={20} />
            </div>
          </div>
        </div>

        {/* Editorial Label below image */}
        <div className="pt-3 pb-1 px-1 flex justify-between items-center text-[#1a2b3c]">
          <span className="text-xs font-sans font-semibold tracking-widest uppercase">
            {item.tag}
          </span>
          <span className="font-serif text-sm italic text-[#1a2b3c]/60">Nº {item.id}</span>
        </div>
      </motion.div>
    </div>
  )
}

export default function Highlights() {
  return (
    <main className="w-full bg-[#dbeebcef] selection:bg-[#1a2b3c] selection:text-white pb-24 border-t border-[#1a2b3c]/10 min-h-screen">
      {/* --- Header Section --- */}
      <section className="container mx-auto px-4 md:px-8 pt-24 pb-16 lg:pb-24 max-w-7xl">
        <div className="max-w-4xl space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Eyebrow Tag */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white border border-[#1a2b3c]/20 rounded-full px-5 py-2 inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1a2b3c]"></span>
            <span className="text-xs uppercase tracking-widest text-[#1a2b3c] font-semibold">
              Curabitur blandit
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl text-[#1a2b3c] leading-[1.05] tracking-tighter">
            Aenean lacinia bibendum nulla sed consectetur.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 64 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-[1px] bg-[#1a2b3c]/30"></motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-base md:text-lg lg:text-xl font-sans text-[#1a2b3c]/70 leading-relaxed max-w-2xl font-light">
            Cras mattis consectetur purus sit amet fermentum. Donec ullamcorper nulla non metus
            auctor fringilla. Maecenas faucibus mollis interdum.
          </motion.p>
        </div>
      </section>

      {/* --- Masonry Gallery Grid --- */}
      <section className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 lg:gap-8">
          {galleryItems.map((item, index) => (
            <GalleryCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </section>
    </main>
  )
}
