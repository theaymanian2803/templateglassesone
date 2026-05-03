import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { supabase } from '@/integrations/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const { itemCount, setIsOpen } = useCart()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: isAdmin } = useQuery({
    queryKey: ['isAdmin', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user!.id)
        .eq('role', 'admin')
        .maybeSingle()
      return !!data
    },
  })

  // Fetch dynamic categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name')

      if (error) throw error
      return data || []
    },
  })

  // Listen for scroll to toggle the header states
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
        setMobileMenuOpen(false) // Close bottom menu if scrolled back to top
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle clicking outside the user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
      setMobileMenuOpen(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setMobileMenuOpen(false)
  }

  return (
    <>
      {/* --- 1. THE TOP HEADER (Scrolls away on Mobile, Sticky on Desktop) --- */}
      <header
        className={`top-0 left-0 w-full z-40 transition-all duration-500 ease-in-out absolute md:fixed ${
          isScrolled
            ? 'md:bg-white/90 md:backdrop-blur-xl md:shadow-[0_4px_20px_rgb(0,0,0,0.05)]'
            : 'bg-transparent'
        }`}>
        <div className="container mx-auto px-6 md:px-12">
          {/* Height remains 20 on mobile. On desktop, it shrinks from 24 to 16 when scrolled */}
          <div
            className={`flex items-center justify-between transition-all duration-500 h-20 ${isScrolled ? 'md:h-16' : 'md:h-24'}`}>
            {/* Mobile Menu Button (Left) */}
            <div className="flex flex-1 lg:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="hover:opacity-60 transition-opacity p-2 -ml-2 text-[#0f172a]"
                aria-label="Menu Mobile">
                <Menu size={24} strokeWidth={1.2} />
              </button>
            </div>

            {/* Desktop Navigation (Left) */}
            <nav className="hidden lg:flex flex-1 items-center gap-8">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.slug}`}
                  className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[#334155] hover:text-[#0f172a] transition-colors relative group py-2">
                  {category.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#0f172a] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
              <Link
                to="/highlights"
                className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[#334155] hover:text-[#0f172a] transition-colors relative group py-2">
                Tendances
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#0f172a] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/about"
                className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[#334155] hover:text-[#0f172a] transition-colors relative group py-2">
                À Propos
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#0f172a] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Logo (Center) */}
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 z-10 flex items-center justify-center hover:opacity-80 transition-opacity">
              <img
                src="/pn.png"
                alt="Optic Modern"
                className="h-10 md:h-12 w-auto object-contain"
              />
            </Link>

            {/* Right Icons */}
            <div className="flex flex-1 items-center justify-end gap-5 md:gap-8 text-[#0f172a]">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Rechercher"
                className="hover:opacity-60 transition-opacity hidden sm:block">
                <Search size={20} strokeWidth={1.2} />
              </button>

              {/* Desktop User Menu */}
              {user ? (
                <div className="relative hidden sm:block" ref={dropdownRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="hover:opacity-60 transition-opacity flex items-center"
                    aria-label="Menu utilisateur">
                    <User size={20} strokeWidth={1.2} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-6 w-56 bg-white/90 backdrop-blur-xl border border-white/50 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-sm animate-in fade-in slide-in-from-top-2">
                      <Link
                        to="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-6 py-2.5 text-[11px] tracking-[0.1em] uppercase font-sans text-[#334155] hover:text-[#0f172a] hover:bg-black/5 transition-colors">
                        Mon Compte
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-6 py-2.5 text-[11px] tracking-[0.1em] uppercase font-sans text-[#334155] hover:text-[#0f172a] hover:bg-black/5 transition-colors">
                          Tableau de Bord
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleSignOut()
                          setUserMenuOpen(false)
                        }}
                        className="block w-full text-left px-6 py-2.5 mt-2 border-t border-black/5 text-[11px] tracking-[0.1em] uppercase font-sans text-red-600 hover:bg-red-50 transition-colors">
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/auth" className="hidden sm:block hover:opacity-60 transition-opacity">
                  <User size={20} strokeWidth={1.2} />
                </Link>
              )}

              {/* Cart Button */}
              <button
                onClick={() => setIsOpen(true)}
                className="relative hover:opacity-60 transition-opacity p-1 -mr-1 md:m-0"
                aria-label="Panier">
                <ShoppingBag size={20} strokeWidth={1.2} />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#0f172a] text-white text-[9px] flex items-center justify-center font-sans font-bold">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Search Dropdown */}
          {searchOpen && (
            <form
              onSubmit={handleSearch}
              className="hidden sm:block pb-8 pt-4 animate-in fade-in slide-in-from-top-4">
              <div className="relative max-w-3xl mx-auto flex items-center border-b border-[#0f172a]">
                <Search size={20} strokeWidth={1.2} className="text-[#0f172a] mr-4" />
                <input
                  type="text"
                  placeholder="Rechercher dans notre collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent py-4 text-sm tracking-widest uppercase font-sans text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-2 hover:opacity-60 transition-opacity">
                  <X size={20} strokeWidth={1.2} className="text-[#0f172a]" />
                </button>
              </div>
            </form>
          )}
        </div>
      </header>

      {/* --- 2. THE COMPACT BOTTOM PILL (Hidden on Desktop) --- */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] md:hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] font-sans ${
          isScrolled && !mobileMenuOpen
            ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
            : 'translate-y-24 opacity-0 scale-95 pointer-events-none'
        }`}>
        <div className="bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/60 rounded-full px-6 py-3 flex items-center gap-5">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center justify-center outline-none mr-1 hover:opacity-80 transition-opacity">
            <img src="/pn.png" alt="Optic Modern" className="h-5 w-auto object-contain" />
          </button>

          <div className="w-px h-5 bg-slate-300/60"></div>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center gap-2 text-[11px] font-bold tracking-[0.1em] text-slate-800 uppercase hover:opacity-60 transition-opacity">
            <Menu size={16} /> Menu
          </button>

          <div className="w-px h-5 bg-slate-300/60"></div>

          <button
            onClick={() => setIsOpen(true)}
            className="relative text-slate-800 hover:opacity-60 transition-opacity pl-1">
            <ShoppingBag size={18} strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 bg-[#0f172a] text-white text-[8px] font-bold flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* --- 3. THE EXPANDED BOTTOM MENU (Hidden on Desktop) --- */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`fixed inset-0 z-[65] md:hidden bg-slate-900/5 backdrop-blur-[2px] transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] w-[calc(100%-3rem)] max-w-md md:hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom font-sans ${
          mobileMenuOpen
            ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
            : 'translate-y-20 opacity-0 scale-95 pointer-events-none'
        }`}>
        <div className="bg-white/95 backdrop-blur-2xl shadow-[0_20px_40px_rgb(0,0,0,0.15)] border border-slate-200/60 rounded-[32px] p-8 flex flex-col relative overflow-hidden max-h-[80vh] overflow-y-auto">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-5 right-5 p-2 bg-slate-100/80 rounded-full text-slate-500 hover:bg-slate-200 hover:text-black transition-colors z-10">
            <X size={16} strokeWidth={2} />
          </button>

          <div className="flex flex-col items-center gap-2 mb-6">
            <img src="/pn.png" alt="Optic Modern" className="h-8 w-auto object-contain" />
          </div>

          {/* Inside Menu Search */}
          <form onSubmit={handleSearch} className="mb-8 relative">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-black/20 py-3 pl-8 pr-4 text-xs tracking-widest uppercase font-sans text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0f172a] transition-colors"
            />
            <Search
              size={16}
              strokeWidth={1.2}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-[#0f172a]"
            />
          </form>

          {/* Main Categories mapped dynamically */}
          <nav className="flex flex-col items-center space-y-5 mb-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-2xl text-[#0f172a] hover:text-[#334155] transition-colors">
                {category.name}
              </Link>
            ))}

            <div className="w-12 h-px bg-black/10 my-2" />

            <Link
              to="/highlights"
              onClick={() => setMobileMenuOpen(false)}
              className="font-serif text-2xl text-[#0f172a] hover:text-[#334155] transition-colors">
              Tendances
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="font-serif text-2xl text-[#0f172a] hover:text-[#334155] transition-colors">
              À Propos
            </Link>
          </nav>

          {/* Account Actions */}
          <div className="pt-6 border-t border-slate-200/60 flex flex-col items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-[10px] font-sans tracking-[0.2em] uppercase text-[#334155] hover:text-[#0f172a]">
                  <User size={16} strokeWidth={1.2} /> Mon Compte
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-[10px] font-sans tracking-[0.2em] uppercase text-[#334155] hover:text-[#0f172a]">
                    Tableau de Bord
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="text-[10px] font-sans tracking-[0.2em] uppercase text-red-600 mt-2">
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-[10px] font-sans tracking-[0.2em] uppercase text-[#334155] hover:text-[#0f172a]">
                <User size={16} strokeWidth={1.2} /> Connexion / Inscription
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
