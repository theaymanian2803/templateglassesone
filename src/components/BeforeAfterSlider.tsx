import { GripVertical } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

const BeforeAfterSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      let newX = clientX - rect.left
      newX = Math.max(0, Math.min(newX, rect.width))
      const newPercentage = (newX / rect.width) * 100
      setSliderPosition(newPercentage)
    },
    [isDragging]
  )

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    handleMove(e.clientX)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    handleMove(e.touches[0].clientX)
  }

  const onStopDragging = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX)
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX)

    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onStopDragging)
      document.addEventListener('touchmove', onTouchMove)
      document.addEventListener('touchend', onStopDragging)
    } else {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onStopDragging)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onStopDragging)
    }
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onStopDragging)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onStopDragging)
    }
  }, [isDragging, handleMove, onStopDragging])

  return (
    <div className="relative w-full bg-[#e8edf2] text-[#0f172a] py-16 md:py-24 overflow-hidden">
      {/* Barre d'offre latérale - Masquée sur très petits écrans, visible sur desktop */}
      <div
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md text-[#0f172a] items-center justify-center py-8 px-2 rounded-r-xl shadow-lg z-10"
        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg) translateY(50%)' }}>
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] whitespace-nowrap">
          OBTENEZ 15% DE RÉDUCTION - OFFRE LIMITÉE
        </span>
      </div>

      <section className="container mx-auto px-4 md:px-8 flex flex-col items-center">
        {/* En-tête de la section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Lunettes 2 en 1 : Vision & Protection en Un Seul Geste
          </h2>
          <p className="font-sans text-base md:text-lg text-[#334155] leading-relaxed">
            Voyez la différence avec nos lunettes 2 en 1 - passez de la vue claire à la protection
            solaire en un clin d'œil.
          </p>
        </div>

        {/* Conteneur principal du Slider */}
        <div
          ref={containerRef}
          className="relative w-full max-w-6xl aspect-[4/5] sm:aspect-square md:aspect-[16/9] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.15)] touch-none select-none cursor-ew-resize group"
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}>
          {/* Image "AVANT" (Arrière-plan) */}
          <img
            src="/before.png"
            alt="Avant - Lunettes claires"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Label Avant */}
          <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 bg-white/60 backdrop-blur-md px-4 py-2 rounded font-sans text-xs md:text-sm font-bold uppercase tracking-widest text-[#0f172a] shadow-sm z-0">
            Avant
          </div>

          {/* Image "APRÈS" (Superposée avec Clip-Path pour de meilleures performances) */}
          <div
            className="absolute inset-0 w-full h-full z-10"
            style={{
              clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
            }}>
            {/* Si vous avez une deuxième image avec les verres teintés, changez la source ici. 
                Si c'est la même image, j'ai ajouté un léger filtre CSS pour simuler l'effet teinté. */}
            <img
              src="/after.png"
              alt="Après - Lunettes teintées"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ filter: 'brightness(0.8) contrast(1.1)' }} // Effet optionnel si image unique
            />
          </div>

          {/* Label Après (Masqué dynamiquement s'il est recouvert par le curseur) */}
          <div
            className="absolute bottom-4 right-4 md:bottom-8 md:right-8 bg-white/60 backdrop-blur-md px-4 py-2 rounded font-sans text-xs md:text-sm font-bold uppercase tracking-widest text-[#0f172a] shadow-sm z-20"
            style={{ opacity: sliderPosition > 85 ? 0 : 1, transition: 'opacity 0.2s' }}>
            Après
          </div>

          {/* Curseur de séparation (Ligne Glassmorphism floutée) */}
          <div
            className="absolute top-0 bottom-0 z-30 flex items-center justify-center pointer-events-none"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}>
            {/* Ligne floutée semi-transparente */}
            <div className="absolute w-2 md:w-4 h-full bg-white/30 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.1)]"></div>

            {/* Bouton de préhension (Grip) */}
            <div className="relative w-10 h-10 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center shadow-xl text-[#0f172a] group-hover:scale-110 transition-transform duration-200">
              <GripVertical size={24} strokeWidth={1.5} className="md:w-7 md:h-7" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BeforeAfterSlider
