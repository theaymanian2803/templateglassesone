import { useState, useEffect } from 'react'
import { Save, RotateCcw, Palette } from 'lucide-react'
import { toast } from 'sonner'

// Helper: Converts Hex (from color picker) to HSL string (for Tailwind)
function hexToHSL(hex: string) {
  let r = 0,
    g = 0,
    b = 0
  if (hex.length === 4) {
    r = parseInt('0x' + hex[1] + hex[1])
    g = parseInt('0x' + hex[2] + hex[2])
    b = parseInt('0x' + hex[3] + hex[3])
  } else if (hex.length === 7) {
    r = parseInt('0x' + hex[1] + hex[2])
    g = parseInt('0x' + hex[3] + hex[4])
    b = parseInt('0x' + hex[5] + hex[6])
  }
  r /= 255
  g /= 255
  b /= 255
  const cmax = Math.max(r, g, b),
    cmin = Math.min(r, g, b),
    delta = cmax - cmin
  let h = 0,
    s = 0,
    l = 0

  if (delta === 0) h = 0
  else if (cmax === r) h = ((g - b) / delta) % 6
  else if (cmax === g) h = (b - r) / delta + 2
  else h = (r - g) / delta + 4

  h = Math.round(h * 60)
  if (h < 0) h += 360
  l = (cmax + cmin) / 2
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

export default function ThemeManager() {
  const [colors, setColors] = useState({
    '--background': '#f5f0e6', // Approximate Hex for your cream
    '--foreground': '#293241',
    '--primary': '#364153',
    '--accent': '#ebdcc7',
  })

  // Load saved colors on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('site_theme')
    if (savedTheme) {
      setColors(JSON.parse(savedTheme))
    }
  }, [])

  const handleColorChange = (variable: string, hexValue: string) => {
    setColors((prev) => ({ ...prev, [variable]: hexValue }))
    // Apply live preview instantly
    document.documentElement.style.setProperty(variable, hexToHSL(hexValue))
  }

  const handleSave = () => {
    // Save to local storage (Future: Save to Supabase 'site_settings' table here)
    localStorage.setItem('site_theme', JSON.stringify(colors))

    // Apply all to document root
    Object.entries(colors).forEach(([key, hex]) => {
      document.documentElement.style.setProperty(key, hexToHSL(hex))
    })

    toast.success('Theme colors saved successfully')
  }

  const handleReset = () => {
    const defaultColors = {
      '--background': '#f5f0e6',
      '--foreground': '#293241',
      '--primary': '#364153',
      '--accent': '#ebdcc7',
    }
    setColors(defaultColors)
    localStorage.removeItem('site_theme')

    // Remove inline overrides so CSS file defaults take over
    Object.keys(defaultColors).forEach((key) => {
      document.documentElement.style.removeProperty(key)
    })
    toast.success('Theme reset to default')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
        <h2 className="font-serif text-2xl flex items-center gap-3">
          <Palette size={24} className="text-muted-foreground" /> Theme Control
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Background Color */}
        <div className="p-5 border border-border bg-card rounded-lg flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Background</p>
            <p className="text-xs text-muted-foreground mt-1">Main website backdrop</p>
          </div>
          <input
            type="color"
            value={colors['--background']}
            onChange={(e) => handleColorChange('--background', e.target.value)}
            className="w-12 h-12 p-1 rounded cursor-pointer bg-transparent border border-border"
          />
        </div>

        {/* Foreground Color */}
        <div className="p-5 border border-border bg-card rounded-lg flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Text (Foreground)</p>
            <p className="text-xs text-muted-foreground mt-1">Main typography color</p>
          </div>
          <input
            type="color"
            value={colors['--foreground']}
            onChange={(e) => handleColorChange('--foreground', e.target.value)}
            className="w-12 h-12 p-1 rounded cursor-pointer bg-transparent border border-border"
          />
        </div>

        {/* Primary Color */}
        <div className="p-5 border border-border bg-card rounded-lg flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Primary</p>
            <p className="text-xs text-muted-foreground mt-1">Buttons and heavy accents</p>
          </div>
          <input
            type="color"
            value={colors['--primary']}
            onChange={(e) => handleColorChange('--primary', e.target.value)}
            className="w-12 h-12 p-1 rounded cursor-pointer bg-transparent border border-border"
          />
        </div>

        {/* Accent Color */}
        <div className="p-5 border border-border bg-card rounded-lg flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Accent</p>
            <p className="text-xs text-muted-foreground mt-1">Subtle backgrounds and hovers</p>
          </div>
          <input
            type="color"
            value={colors['--accent']}
            onChange={(e) => handleColorChange('--accent', e.target.value)}
            className="w-12 h-12 p-1 rounded cursor-pointer bg-transparent border border-border"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-6 mt-6 border-t border-border">
        <button
          onClick={handleSave}
          className="flex-1 btn-luxury flex items-center justify-center gap-2">
          <Save size={16} /> Save Theme
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 border border-destructive text-destructive font-sans text-sm font-medium tracking-widest uppercase hover:bg-destructive/10 transition-colors flex items-center gap-2">
          <RotateCcw size={16} /> Reset
        </button>
      </div>
    </div>
  )
}
