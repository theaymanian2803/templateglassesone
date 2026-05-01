import BeforeAfterSlider from '@/components/BeforeAfterSlider'
import { Eye, Glasses } from 'lucide-react'
import { Link } from 'react-router-dom'

// EXTERNAL PLACEHOLDER IMAGES
const modelImg =
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop'
const pedestalGlassesImg =
  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop'
const boxImg =
  'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=800&auto=format&fit=crop'
const avatarImg =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'
const trustImg = '/mahal.png' // Added placeholder for the trust section

import CraftsmanshipProducts from '@/components/CraftsmanshipProducts'
import { useCart } from '@/contexts/CartContext'

export default function Index() {
  const { cartOpen, setCartOpen } = useCart()

  return (
    <main className="bg-background">
      {/* Hero Section Recreated from Image */}
      <section className="relative w-full min-h-screen bg-gradient-to-br from-[#e8edf2] to-[#d6dfeb] text-[#0f172a] overflow-hidden pt-24 pb-12 px-6 lg:px-12 font-sans">
        <div className="max-w-[1600px] mx-auto">
          {/* Top Half */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-8">
            {/* Left Column: Model & Badges */}
            <div className="w-full lg:w-5/12 relative flex justify-center lg:justify-start">
              {/* Top Left Floating Text */}
              <div className="absolute -top-4 -left-4 lg:top-0 lg:-left-8 z-10 space-y-4">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/40 backdrop-blur-sm rounded-full text-[10px] font-bold tracking-[0.15em] uppercase border border-white/40 shadow-sm">
                  <Eye size={12} className="text-[#3b82f6]" /> LENTILLES PRO
                </span>
                <p className="text-sm md:text-base font-medium max-w-[200px] leading-snug">
                  Le Duo Ultime -<br />
                  <span className="font-bold">Clarté</span> & Confiance
                </p>
              </div>

              {/* Middle Left Floating Avatars */}
              <div className="absolute top-1/2 -left-4 lg:-left-12 -translate-y-1/2 z-10 flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={avatarImg}
                    alt="Profil"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                  />
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Glasses size={18} />
                  </div>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] leading-tight max-w-[140px]">
                  PRÉCISION EN MOUVEMENT, ÉLÉGANCE DANS LA FORME.
                </p>
              </div>

              {/* Center Model Image */}
              <div className="relative w-[85%] max-w-[400px] mx-auto lg:ml-24 lg:mt-12">
                {/* Custom Clip Path to match the angled corners in the image */}
                <div
                  className="relative aspect-[3/4] bg-white p-2 md:p-4 shadow-xl"
                  style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)' }}>
                  <img
                    src={modelImg}
                    alt="Modèle portant des lunettes"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Main Typography */}
            <div className="w-full lg:w-7/12 pt-8 lg:pt-0 lg:pl-12 flex flex-col justify-start">
              <div className="mb-6">
                <span className="inline-block px-4 py-1.5 bg-white/40 backdrop-blur-sm border border-white/50 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm">
                  SANTÉ OCULAIRE À 30 ANS
                </span>
              </div>

              <h1 className="font-serif text-6xl md:text-8xl lg:text-[140px] leading-[0.85] tracking-tight mb-8">
                VOIR LA
                <br />
                DIFFÉRENCE
              </h1>

              <div className="flex items-center gap-4 mb-10 pl-2 border-l border-black/20">
                <p className="text-sm md:text-base max-w-md font-medium text-[#334155] leading-relaxed">
                  Pas seulement des lunettes — un mélange unique{' '}
                  <span className="font-bold text-[#0f172a]">d'élégance</span>, de technologie de
                  pointe et d'accessibilité
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <Link
                  to="/products"
                  className="bg-[#1a2332] text-white px-8 py-4 text-xs font-sans tracking-[0.15em] uppercase hover:bg-black transition-colors shadow-lg">
                  Explorer les Lunettes
                </Link>
                <span className="text-sm md:text-base font-medium">À partir de 99 MAD</span>
              </div>
            </div>
          </div>

          {/* Bottom Half */}
          <div className="flex flex-col-reverse lg:flex-row justify-between items-end gap-12 mt-20 lg:mt-32">
            {/* Bottom Left: Revolutionizing Vision */}
            <div className="w-full lg:w-1/2 relative pb-8">
              <div className="bg-white px-8 py-5 inline-block shadow-lg mb-8">
                <span className="font-serif text-3xl">99 MAD</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-[#0f172a] max-w-2xl relative">
                Révolutionner la vision avec des lunettes tendance qui affirment votre style.{' '}
                <span className="inline-block ml-2 opacity-80">👓</span>
                <div className="absolute -top-12 left-0 w-full h-px bg-black/10" />
              </h2>
            </div>

            {/* Bottom Right: Product Showcases */}
            <div className="w-full lg:w-1/2 flex flex-col sm:flex-row justify-end items-end gap-6 lg:gap-12 relative">
              <div className="absolute top-10 left-0 w-full h-px bg-black/10 hidden lg:block" />

              <div className="relative w-full sm:w-64">
                <img
                  src={pedestalGlassesImg}
                  alt="Lunettes sur piédestal"
                  className="w-full h-[300px] object-cover shadow-lg bg-white p-2"
                />
              </div>

              <div className="bg-white p-6 shadow-xl w-full sm:w-64 flex flex-col justify-between min-h-[300px]">
                <h3 className="font-serif text-2xl leading-tight mb-6 pr-4">
                  Outils de Protection Oculaire
                </h3>
                <img src={boxImg} alt="Étui à lunettes" className="w-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Success Section */}
      <section className="bg-white py-20 md:py-32 border-b border-black/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center max-w-[1400px] mx-auto">
            {/* Image Side */}
            <div className="relative w-full aspect-square lg:aspect-[4/3] bg-muted/20 overflow-hidden">
              <img
                src={trustImg}
                alt="Client satisfait avec son achat"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 ease-out"
              />
            </div>

            {/* Content Side */}
            <div className="flex flex-col justify-center space-y-6">
              <p className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase text-muted-foreground">
                Notre plus belle réussite
              </p>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#0f172a] leading-[1.1] tracking-tight">
                La confiance de
                <br className="hidden md:block" /> milliers de clients
              </h2>

              <p className="text-sm md:text-base font-sans text-[#334155] leading-relaxed max-w-lg pb-4">
                Plus de 20 000 clients nous font confiance grâce à notre service sur mesure, nos
                conseils experts et la qualité de nos produits.
              </p>

              <Link to="/about" className="group inline-flex items-center w-max">
                <span className="text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-[#0f172a] border-b-2 border-[#0f172a] pb-1 group-hover:text-muted-foreground group-hover:border-muted-foreground transition-all duration-300">
                  En savoir plus sur notre histoire
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="p-7">
          <CraftsmanshipProducts />
        </div>
      </section>
      <section>
        <BeforeAfterSlider />
      </section>

      {/* Editorial Content Section */}
      <section className="container mx-auto px-6 py-24 md:py-40">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <p className="text-[10px] font-sans tracking-[0.5em] uppercase text-muted-foreground">
            Qualité Artisanale
          </p>
          <h2 className="font-serif text-4xl md:text-6xl leading-[1.1]">
            Conçu avec intention,
            <br />
            <span className="italic text-muted-foreground">fabriqué pour le voyage.</span>
          </h2>
          <div className="w-px h-16 bg-border mx-auto" />
          <p className="text-sm md:text-base font-sans text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Chaque monture est finie à la main par des artisans en petites séries, en utilisant
            uniquement les meilleurs matériaux en provenance d'Italie et du Japon. Nous croyons que
            les lunettes sont une extension de votre identité.
          </p>
          <div className="pt-3">
            <Link
              to="/products"
              className="text-xs font-sans tracking-[0.3em] uppercase underline underline-offset-8 hover:text-muted-foreground transition-colors">
              adoptez la saison
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
