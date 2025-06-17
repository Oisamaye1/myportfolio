"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ImageIcon, X } from "lucide-react"

interface ImagePreviewInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function ImagePreviewInput({ value, onChange, placeholder, className }: ImagePreviewInputProps) {
  const [imageError, setImageError] = useState(false)

  const handleImageLoad = () => {
    setImageError(false)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const clearImage = () => {
    onChange("")
    setImageError(false)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex gap-2">
        <Input
          type="url"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setImageError(false)
          }}
          placeholder={placeholder || "https://example.com/image.jpg"}
          className="flex-1"
        />
        {value && (
          <Button type="button" variant="outline" size="icon" onClick={clearImage} className="shrink-0">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {value && (
        <div className="flex justify-center">
          <div className="relative group">
            {!imageError ? (
              <img
                src={value || "/placeholder.svg"}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-primary/20 shadow-lg"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-red-200 bg-red-50 flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="h-8 w-8 text-red-400 mx-auto mb-1" />
                  <span className="text-xs text-red-600">Invalid Image</span>
                </div>
              </div>
            )}

            <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white text-xs font-medium">Preview</span>
            </div>
          </div>
        </div>
      )}

      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Use a square image (400x400px or larger) for best results</p>
        <p>• Supported formats: JPG, PNG, WebP</p>
        <p>• Image should be publicly accessible via URL</p>
      </div>
    </div>
  )
}
