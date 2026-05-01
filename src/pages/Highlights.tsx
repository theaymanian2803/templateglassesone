import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

// Placeholder data - replace the src with your actual client images
const clientHighlights = [
  {
    id: 1,
    src: '/one.png',

    height: 'h-[400px]',
  },
  {
    id: 2,
    src: '/eleven.png',

    height: 'h-[300px]',
  },
  {
    id: 3,
    src: '/three.png',

    height: 'h-[500px]',
  },
  {
    id: 4,
    src: '/four.png',
    height: 'h-[350px]',
  },
  {
    id: 5,
    src: '/five.png',
    height: 'h-[450px]',
  },
  {
    id: 6,
    src: '/six.png',
    height: 'h-[300px]',
  },
  {
    id: 7,
    src: '/seven.png',
    height: 'h-[400px]',
  },
  {
    id: 8,
    src: '/eight.png',
    height: 'h-[350px]',
  },
  {
    id: 8,
    src: '/nine.png',
    height: 'h-[350px]',
  },
  {
    id: 8,
    src: '/ten.png',
    height: 'h-[350px]',
  },
]

// Individual card component to handle its own parallax calculation
const HighlightCard = ({ client, index }) => {
  const ref = useRef(null)

  // Creates a subtle parallax scroll effect for each image container
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // The image inside will slowly translate on the Y axis as you scroll
  const imageY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: 'easeOut' }}
      className={`break-inside-avoid relative overflow-hidden bg-muted border border-border group mb-6 ${client.height}`}>
      {/* Parallax Image */}
      <motion.img
        style={{ y: imageY }}
        src={client.src}
        alt={`Client wearing ${client.frame}`}
        className="absolute inset-0 w-full h-[120%] object-cover object-center -top-[10%]"
      />

      {/* Minimalist Overlay that appears on hover */}
      <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-20 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center"></div>
    </motion.div>
  )
}

export default function Highlights() {
  return (
    <main className="container mx-auto px-4 md:px-8 py-16 md:py-24 max-w-7xl flex-grow min-h-[calc(100vh-24rem)]">
      {/* Header Section */}
      <div className="max-w-3xl mb-16 md:mb-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
          Client Highlights
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 48 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-[2px] bg-foreground mt-6 mb-8"></motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-base md:text-lg font-sans text-muted-foreground leading-relaxed">
          Discover how our clients style their favorite frames from Zouaq Optique. A curated gallery
          of real people, real clarity, and impeccable taste. Tag us to be featured in our
          highlights.
        </motion.p>
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
        {clientHighlights.map((client, index) => (
          <HighlightCard key={index} client={client} index={index} />
        ))}
      </div>
    </main>
  )
}
