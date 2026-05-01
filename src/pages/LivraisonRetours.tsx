import { Clock, RotateCcw, ShieldCheck, Truck } from 'lucide-react'

export default function LivraisonRetours() {
  return (
    <main className="min-h-screen bg-[#e8edf2] text-[#0f172a] pt-24 pb-32">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="font-serif text-5xl md:text-7xl leading-tight mb-6">
            Livraison & Retours
          </h1>
          <p className="text-base font-sans text-[#334155] max-w-2xl mx-auto">
            Nous croyons en une expérience d'achat sans friction. Nos politiques sont conçues pour
            être claires, simples et toujours à votre avantage.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Shipping Column */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <Truck size={32} strokeWidth={1} className="text-[#0f172a]" />
              <h2 className="font-serif text-3xl">Expédition</h2>
            </div>

            <div className="bg-white p-8 border border-black/5 shadow-lg">
              <div className="flex justify-between items-end border-b border-[#0f172a]/10 pb-4 mb-4">
                <div>
                  <h3 className="font-sans font-bold text-sm uppercase tracking-widest mb-1">
                    Standard
                  </h3>
                  <p className="text-sm font-sans text-[#334155]">3 à 5 jours ouvrés</p>
                </div>
                <span className="font-serif text-xl">Gratuit</span>
              </div>

              <div className="flex justify-between items-end border-b border-[#0f172a]/10 pb-4 mb-4">
                <div>
                  <h3 className="font-sans font-bold text-sm uppercase tracking-widest mb-1">
                    Express
                  </h3>
                  <p className="text-sm font-sans text-[#334155]">1 à 2 jours ouvrés</p>
                </div>
                <span className="font-serif text-xl">49 MAD</span>
              </div>

              <div className="mt-8 pt-4">
                <p className="text-sm font-sans text-[#334155] leading-relaxed">
                  Toutes nos commandes sont expédiées depuis notre atelier à Marrakech. Vous
                  recevrez un numéro de suivi dès que votre colis quittera nos locaux. Pour les
                  lunettes avec verres correcteurs, prévoyez 2 à 4 jours supplémentaires pour la
                  fabrication.
                </p>
              </div>
            </div>
          </div>

          {/* Returns Column */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <RotateCcw size={32} strokeWidth={1} className="text-[#0f172a]" />
              <h2 className="font-serif text-3xl">Retours</h2>
            </div>

            <div className="bg-white p-8 border border-black/5 shadow-lg h-full">
              <h3 className="font-sans font-bold text-sm uppercase tracking-widest mb-4">
                Politique des 30 Jours
              </h3>
              <p className="text-sm font-sans text-[#334155] leading-relaxed mb-8">
                Si vous n'êtes pas entièrement satisfait de votre achat, nous acceptons les retours
                dans les 30 jours suivant la réception de votre commande, à condition que les
                lunettes soient dans leur état d'origine.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <ShieldCheck size={20} className="text-[#0f172a] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-serif text-lg mb-1">Remboursement Intégral</h4>
                    <p className="text-xs font-sans text-[#334155]">
                      Nous remboursons le montant total sur votre mode de paiement original.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock size={20} className="text-[#0f172a] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-serif text-lg mb-1">Traitement Rapide</h4>
                    <p className="text-xs font-sans text-[#334155]">
                      Les retours sont traités sous 48h après réception à notre atelier.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
