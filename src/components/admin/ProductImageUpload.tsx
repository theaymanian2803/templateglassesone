import { supabase } from '@/integrations/supabase/client'
import { Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

interface ProductImageUploadProps {
  imageUrls: string[]
  onImagesChange: (urls: string[]) => void
}

export default function ProductImageUpload({ imageUrls, onImagesChange }: ProductImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [mode, setMode] = useState<'url' | 'upload'>('upload')
  const [tempUrl, setTempUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const maxImages = 5

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    if (imageUrls.length + files.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images total.`)
      return
    }

    const invalidFiles = files.filter(
      (f) => !f.type.startsWith('image/') || f.size > 5 * 1024 * 1024
    )
    if (invalidFiles.length > 0) {
      toast.error('All files must be images under 5MB.')
      return
    }

    setUploading(true)
    try {
      const newUrls: string[] = []

      for (const file of files) {
        const ext = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file, { cacheControl: '3600', upsert: false })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName)

        newUrls.push(urlData.publicUrl)
      }

      onImagesChange([...imageUrls, ...newUrls])
      toast.success('Images uploaded successfully')
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = '' // Reset input
    }
  }

  const handleAddUrl = () => {
    if (!tempUrl.trim()) return
    if (imageUrls.length >= maxImages) {
      toast.error(`Maximum of ${maxImages} images allowed.`)
      return
    }
    onImagesChange([...imageUrls, tempUrl.trim()])
    setTempUrl('')
  }

  const removeImage = (indexToRemove: number) => {
    onImagesChange(imageUrls.filter((_, i) => i !== indexToRemove))
  }

  const inputClass =
    'w-full bg-transparent border border-border px-3 py-2 text-sm font-sans focus:outline-none focus:border-foreground transition-colors'

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-3 py-1.5 text-xs font-sans border transition-all ${mode === 'upload' ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent border-border hover:border-foreground'}`}>
          Upload Images
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-3 py-1.5 text-xs font-sans border transition-all ${mode === 'url' ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent border-border hover:border-foreground'}`}>
          Paste URL
        </button>
      </div>

      {imageUrls.length < maxImages &&
        (mode === 'url' ? (
          <div className="flex gap-2">
            <input
              placeholder="Image URL"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              className={inputClass}
            />
            <button
              type="button"
              onClick={handleAddUrl}
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-sans hover:opacity-90 transition-opacity">
              Add
            </button>
          </div>
        ) : (
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`border border-dashed border-border p-6 cursor-pointer hover:border-foreground transition-colors flex flex-col items-center justify-center gap-3 text-center ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <Upload size={24} className="text-muted-foreground" />
            <span className="text-sm font-sans text-muted-foreground">
              {uploading
                ? 'Uploading...'
                : `Click to select multiple images (max ${maxImages - imageUrls.length} more)`}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </div>
        ))}

      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {imageUrls.map((url, idx) => (
            <div
              key={idx}
              className="relative group aspect-square border border-border rounded-md overflow-hidden bg-muted/10">
              <img
                src={url}
                alt={`Product preview ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-destructive/90"
                title="Remove image">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        {imageUrls.length} / {maxImages} images uploaded
      </div>
    </div>
  )
}
