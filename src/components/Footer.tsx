import { supabase } from '@/integrations/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Facebook, Instagram, Twitter } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  // Fetch dynamic categories from Supabase
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name')
      if (error) throw error
      return data || []
    },
  })

  return (
    <footer className="bg-[#e8edf2] text-[#0f172a] pt-20 pb-10">
      <div className="container mx-auto px-6 md:px-12">
        {/* Top Section: Newsletter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-16 border-b border-[#0f172a]/10 mb-16 gap-10">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Rejoignez l'Initié.</h2>
            <p className="text-sm font-sans text-[#334155] leading-relaxed">
              Inscrivez-vous pour bénéficier d'un accès anticipé aux nouvelles collections,
              d'événements exclusifs et de conseils sur le style de vos lunettes.
            </p>
          </div>
          <div className="w-full md:w-auto flex-1 max-w-md">
            <form className="flex items-end border-b border-[#0f172a]/30 focus-within:border-[#0f172a] transition-colors pb-2">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="w-full bg-transparent border-none outline-none text-sm font-sans placeholder:text-[#0f172a]/40 px-2 text-[#0f172a]"
                required
              />
              <button
                type="submit"
                className="p-2 hover:opacity-70 transition-opacity text-[#0f172a]">
                <ArrowRight size={20} strokeWidth={1.5} />
              </button>
            </form>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">
          {/* Brand Info */}
          <div className="md:col-span-4 lg:col-span-5">
            <Link to="/" className="inline-block mb-6">
              <h3 className="font-serif text-2xl tracking-wide">Optic Modern</h3>
            </Link>
            <p className="text-sm font-sans text-[#334155] leading-relaxed max-w-sm mb-8">
              Des lunettes haut de gamme conçues pour l'individu moderne. Créées avec intention,
              bâties pour durer, et pensées pour affirmer votre style.
            </p>
            <div className="flex items-center gap-5">
              <a
                href="#"
                className="text-[#0f172a]/60 hover:text-[#0f172a] transition-colors"
                aria-label="Instagram">
                <Instagram size={20} strokeWidth={1.5} />
              </a>
              <a
                href="#"
                className="text-[#0f172a]/60 hover:text-[#0f172a] transition-colors"
                aria-label="Facebook">
                <Facebook size={20} strokeWidth={1.5} />
              </a>
              <a
                href="#"
                className="text-[#0f172a]/60 hover:text-[#0f172a] transition-colors"
                aria-label="Twitter">
                <Twitter size={20} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Dynamic Categories */}
          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#0f172a]/50 mb-6">
              Boutique
            </h4>
            <div className="space-y-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.slug}`}
                  className="block text-sm font-sans text-[#334155] hover:text-[#0f172a] transition-colors">
                  {category.name}
                </Link>
              ))}
              <Link
                to="/products"
                className="block text-sm font-sans text-[#334155] hover:text-[#0f172a] transition-colors">
                Toute la Collection
              </Link>
            </div>
          </div>

          {/* Help Links */}
          <div className="md:col-span-2 lg:col-span-2">
            <h4 className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#0f172a]/50 mb-6">
              Assistance
            </h4>
            <div className="space-y-4">
              <Link
                to="/try-on"
                className="block text-sm font-sans text-[#334155] hover:text-[#0f172a] transition-colors">
                Essayage à Domicile
              </Link>
              <Link
                to="/shipping"
                className="block text-sm font-sans text-[#334155] hover:text-[#0f172a] transition-colors">
                Livraison & Retours
              </Link>
              <Link
                to="/faq"
                className="block text-sm font-sans text-[#334155] hover:text-[#0f172a] transition-colors">
                FAQ
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#0f172a]/50 mb-6">
              Contact
            </h4>
            <div className="space-y-4 text-sm font-sans text-[#334155]">
              <p className="hover:text-[#0f172a] transition-colors cursor-pointer lowercase">
                ZOUAQOPTIQ@GMAIL.COM
              </p>
              <p className="hover:text-[#0f172a] transition-colors cursor-pointer">
                +212 (0) 668-966898
              </p>
              <p className="pt-2">
                MHAMID 7 <br />
                Marrakech
                <br />
                Maroc
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-[#0f172a]/10 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-sans text-[#0f172a]/40 tracking-wider">
            © {new Date().getFullYear()} Optic Modern. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6 text-[11px] font-sans text-[#0f172a]/40 tracking-wider">
            <Link to="/privacy" className="hover:text-[#0f172a] transition-colors">
              Politique de Confidentialité
            </Link>
            <Link to="/terms" className="hover:text-[#0f172a] transition-colors">
              Conditions Générales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
