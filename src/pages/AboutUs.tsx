import { motion } from 'framer-motion'
import { Hexagon, Infinity, Plus, ShieldCheck } from 'lucide-react'

// --- Animation Variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
}

export default function AboutUs() {
  return (
    // Cleaned up background class using our custom utility
    <main className="w-full bg-gradient-bg selection:bg-black selection:text-white font-sans border-t border-border/50">
      {/* --- Section 1: Hero-like Layout --- */}
      <section className="container mx-auto px-4 md:px-8 py-16 lg:py-24 max-w-7xl mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,minmax(auto,1fr)] gap-12 lg:gap-24 items-start">
          {/* Left: Framed Image Column */}
          <motion.div
            className="relative h-[600px] lg:h-[750px] w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}>
            <div
              className="absolute inset-0 bg-white border border-border overflow-hidden p-6"
              style={{
                clipPath:
                  'polygon(0% 0%, 100% 0%, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0% 100%, 0% 0px)',
              }}>
              <div className="w-full h-full border-[10px] border-white z-10">
                <img
                  src="https://plus.unsplash.com/premium_photo-1693222144068-513f78a25a29?q=80&w=987&auto=format&fit=crop"
                  alt="Abstract premium placeholder"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              </div>

              <div className="absolute top-1/2 left-6 transform -translate-y-1/2 flex flex-col gap-3">
                <img
                  src="/images/placeholder-profile.jpg"
                  alt="Profile"
                  className="w-10 h-10 rounded-full border border-border"
                />
                <div className="w-10 h-10 border border-border rounded-full flex items-center justify-center text-border">
                  <Infinity size={18} />
                </div>
              </div>
            </div>

            <div className="absolute bottom-12 right-12 lg:bottom-12 lg:-right-12 w-32 h-32 bg-white rounded-full border border-border flex items-center justify-center p-2 z-20">
              <div className="w-full h-full border border-dashed border-border rounded-full flex flex-col items-center justify-center text-center">
                <span className="text-xs uppercase tracking-widest text-muted-foreground/80">
                  Est
                </span>
                <span className="text-lg font-serif text-[#1a2b3c]">202X</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Typography & Gibberish Content */}
          <motion.div
            className="space-y-8 lg:pl-10 text-center lg:text-left flex flex-col items-center lg:items-start"
            variants={staggerContainer}
            initial="hidden"
            animate="visible">
            <motion.div variants={fadeUp} className="flex justify-center w-full">
              <div className="bg-white border border-border rounded-full px-5 py-2 font-sans text-sm font-medium text-[#1a2b3c]/80 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-border"></span>
                Phasellus Volutpat
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl text-[#1a2b3c] leading-[1.05] tracking-tighter">
                Curabitur blandit tempus porttitor.
              </h1>
            </motion.div>

            <motion.div variants={fadeUp} className="w-16 h-[1px] bg-border/50" />

            <motion.div
              variants={fadeUp}
              className="space-y-6 text-base md:text-lg text-[#1a2b3c]/80 font-light leading-relaxed">
              <p>
                Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus
                et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum id ligula porta
                felis euismod semper.
              </p>
              <p>
                Donec ullamcorper nulla non metus auctor fringilla. Maecenas sed diam eget risus
                varius blandit sit amet non magna. Integer posuere erat a ante venenatis dapibus
                posuere velit aliquet.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-4 justify-center lg:justify-start pt-4 w-full">
              <button className="bg-[#1a2b3c] text-white rounded-full px-10 py-3.5 font-sans text-sm font-semibold uppercase tracking-wider hover:bg-[#2a3b4c] transition-colors">
                Ullamcorper Fringilla
              </button>
              <p className="text-sm font-sans text-[#1a2b3c]/80">Vehicula Ut — 99X</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- Section 2: Feature Grid --- */}
      <section className="container mx-auto px-4 md:px-8 py-24 max-w-7xl border-t border-border/50 mt-12">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}>
          <h2 className="font-serif text-3xl md:text-4xl text-[#1a2b3c]">Nibh Vehicula Ut</h2>
          <p className="text-[#1a2b3c]/70 max-w-2xl mx-auto font-light">
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem
            nec elit.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}>
          <motion.div
            variants={fadeUp}
            className="bg-white border border-border p-10 hover:shadow-lg transition-shadow relative group"
            style={{
              clipPath:
                'polygon(20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%, 0% 20px)',
            }}>
            <Hexagon className="w-8 h-8 text-[#1a2b3c]/70 mb-6" strokeWidth={1.5} />
            <h3 className="font-serif text-xl text-[#1a2b3c] mb-3">Lorem Ipsum</h3>
            <p className="text-sm text-[#1a2b3c]/70 leading-relaxed">
              Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Vivamus sagittis lacus
              vel augue laoreet rutrum.
            </p>
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-border">
                <Plus size={16} />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="bg-white border border-border p-10 hover:shadow-lg transition-shadow relative group"
            style={{
              clipPath:
                'polygon(20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%, 0% 20px)',
            }}>
            <ShieldCheck className="w-8 h-8 text-[#1a2b3c]/70 mb-6" strokeWidth={1.5} />
            <h3 className="font-serif text-xl text-[#1a2b3c] mb-3">Dolor Egestas</h3>
            <p className="text-sm text-[#1a2b3c]/70 leading-relaxed">
              Maecenas sed diam eget risus varius blandit sit amet non magna. Cras justo odio,
              dapibus ac facilisis in.
            </p>
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-border">
                <Plus size={16} />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="bg-white border border-border p-10 hover:shadow-lg transition-shadow relative group"
            style={{
              clipPath:
                'polygon(20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%, 0% 20px)',
            }}>
            <Infinity className="w-8 h-8 text-[#1a2b3c]/70 mb-6" strokeWidth={1.5} />
            <h3 className="font-serif text-xl text-[#1a2b3c] mb-3">Pellentesque</h3>
            <p className="text-sm text-[#1a2b3c]/70 leading-relaxed">
              Cras mattis consectetur purus sit amet fermentum. Nulla vitae elit libero, a pharetra
              augue.
            </p>
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-border">
                <Plus size={16} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* --- Section 3: Generic Quote Statement --- */}
      <section className="container mx-auto px-4 py-24 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="space-y-8">
          <div className="w-12 h-[1px] bg-[#1a2b3c]/30 mx-auto" />
          <h2 className="font-serif text-2xl md:text-4xl text-[#1a2b3c]/90 leading-tight italic">
            "Donec id elit non mi porta gravida at eget metus. Sed posuere consectetur est at
            lobortis. Nullam id dolor id nibh ultricies."
          </h2>
          <div className="w-12 h-[1px] bg-[#1a2b3c]/30 mx-auto" />
          <p className="text-xs uppercase tracking-[0.2em] text-[#1a2b3c]/40 pt-4">
            — Commodo Cursus
          </p>
        </motion.div>
      </section>
    </main>
  )
}
