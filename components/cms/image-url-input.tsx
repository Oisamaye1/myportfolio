"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ImageUrlInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  previewClassName?: string
}

export function ImageUrlInput({
  label,
  value,
  onChange,
  placeholder = "https://example.com/image.jpg",
  previewClassName = "w-full max-w-sm h-32 object-cover rounded-md border",
}: ImageUrlInputProps) {
  const [showPreview, setShowPreview] = useState(!!value)
  const [imageError, setImageError] = useState(false)

  const handleImageLoad = () => {
    setImageError(false)
    setShowPreview(true)
  }

  const handleImageError = () => {
    setImageError(true)
    setShowPreview(false)
  }

  const clearImage = () => {
    onChange("")
    setShowPreview(false)
    setImageError(false)
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setImageError(false)
            setShowPreview(false)
          }}
          placeholder={placeholder}
          className="flex-1"
        />
        {value && (
          <Button type="button" variant="outline" size="icon" onClick={clearImage}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {value && !imageError && (
        <div className="mt-2">
          <p className="text-sm text-muted-foreground mb-2">Preview:</p>
          <img
            src={value || "/placeholder.svg"}
            alt="Preview"
            className={previewClassName}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      )}

      {imageError && <p className="text-sm text-destructive">Failed to load image. Please check the URL.</p>}

      <div className="text-xs text-muted-foreground">
        <p>💡 Tips for best results:</p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>Use direct image URLs (ending in .jpg, .png, .webp, etc.)</li>
          <li>Ensure the image is publicly accessible</li>
          <li>Consider using image hosting services like Imgur, Cloudinary, or Unsplash</li>
          <li>Recommended aspect ratio: 16:9 for featured images</li>
        </ul>
      </div>
    </div>
  )
}
