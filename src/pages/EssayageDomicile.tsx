import { Box, CheckCircle, Glasses, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'

const steps = [
  {
    icon: Glasses,
    title: '1. Sélectionnez vos favoris',
    desc: "Parcourez notre collection et choisissez jusqu'à 4 montures à essayer chez vous, gratuitement.",
  },
  {
    icon: Box,
    title: '2. Recevez votre coffret',
    desc: 'Nous vous expédions votre sélection dans un coffret personnalisé, avec livraison express offerte.',
  },
  {
    icon: CheckCircle,
    title: '3. Prenez votre temps',
    desc: "Vous avez 5 jours pour les essayer. Demandez l'avis de vos proches et prenez des selfies.",
  },
  {
    icon: Truck,
    title: '4. Renvoyez simplement',
    desc: "Gardez celles que vous aimez, renvoyez le reste avec l'étiquette de retour prépayée incluse.",
  },
]

export default function EssayageDomicile() {
  return (
    <main className="min-h-screen bg-[#e8edf2] text-[#0f172a] pt-24 pb-32">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <p className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase text-[#0f172a]/60 mb-6">
            L'Expérience Optic Modern
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-8">
            Votre salon est votre
            <br />
            <span className="italic opacity-90">nouvelle boutique.</span>
          </h1>
          <p className="text-base md:text-lg font-sans text-[#334155] leading-relaxed max-w-2xl mx-auto">
            Ne devinez plus si une monture vous va. Essayez nos lunettes dans le confort de votre
            maison, avec vos propres tenues et votre propre miroir. Totalement gratuit.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 mb-10 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-0 relative z-0">
          {steps.map((step, index) => (
            <div key={index} className="bg-[#f4f7f9] p-10 md:p-12 pb-24 flex flex-col items-start">
              <div className="w-12 h-12 bg-[#0f172a] text-white flex items-center justify-center rounded-full mb-10">
                <step.icon size={20} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl mb-4">{step.title}</h3>
              <p className="text-sm font-sans text-[#334155] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Call to Action - Overlapping Box */}
        <div className="bg-white py-16 px-6 md:px-12 text-center shadow-[0_20px_60px_rgba(0,0,0,0.06)] relative z-10 max-w-[95%] lg:max-w-[85%] mx-auto -mt-16">
          <h2 className="font-serif text-3xl md:text-4xl mb-6">Prêt à trouver votre style ?</h2>
          <p className="text-sm md:text-base font-sans text-[#334155] mb-10 max-w-lg mx-auto">
            Parcourez notre catalogue et repérez l'icône "Essai à domicile" sur vos montures
            préférées.
          </p>
          <Link
            to="/products"
            className="inline-block bg-[#0f172a] text-white px-8 py-4 text-[11px] font-sans font-bold tracking-[0.2em] uppercase hover:bg-black transition-colors">
            Commencer la sélection
          </Link>
        </div>
      </div>
    </main>
  )
}
