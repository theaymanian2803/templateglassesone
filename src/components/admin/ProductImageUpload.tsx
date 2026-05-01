import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Image } from "lucide-react";
import { toast } from "sonner";

interface ProductImageUploadProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
}

export default function ProductImageUpload({ imageUrl, onImageChange }: ProductImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<"url" | "upload">(imageUrl ? "url" : "url");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      onImageChange(urlData.publicUrl);
      toast.success("Image uploaded successfully");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const inputClass =
    "w-full bg-transparent border border-border px-3 py-2 text-sm font-sans focus:outline-none focus:border-foreground transition-colors";

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`px-3 py-1.5 text-xs font-sans border transition-all ${mode === "url" ? "bg-primary text-primary-foreground border-primary" : "bg-transparent border-border hover:border-foreground"}`}
        >
          Paste URL
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`px-3 py-1.5 text-xs font-sans border transition-all ${mode === "upload" ? "bg-primary text-primary-foreground border-primary" : "bg-transparent border-border hover:border-foreground"}`}
        >
          Upload Image
        </button>
      </div>

      {mode === "url" ? (
        <input
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => onImageChange(e.target.value)}
          className={inputClass}
        />
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-border p-4 cursor-pointer hover:border-foreground transition-colors flex items-center gap-3"
        >
          <Upload size={18} className="text-muted-foreground shrink-0" />
          <span className="text-xs font-sans text-muted-foreground">
            {uploading ? "Uploading..." : "Click to select an image (max 5MB)"}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </div>
      )}

      {imageUrl && (
        <div className="relative inline-block">
          <img src={imageUrl} alt="Preview" className="w-20 h-20 object-cover border border-border" />
          <button
            type="button"
            onClick={() => onImageChange("")}
            className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
