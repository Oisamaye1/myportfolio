"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Settings } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImagePreviewInput } from "./image-preview-input"

interface SiteSettings {
  [key: string]: string
}

export function SettingsManagement() {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/cms/settings", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")

    try {
      const response = await fetch("/api/cms/settings", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setMessage("Settings saved successfully!")
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage("Failed to save settings")
      }
    } catch (error) {
      setMessage("Network error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value })
  }

  const settingsConfig = [
    { key: "site_title", label: "Site Title", type: "text" },
    { key: "site_description", label: "Site Description", type: "textarea" },
    { key: "hero_title", label: "Hero Title", type: "text" },
    { key: "hero_subtitle", label: "Hero Subtitle", type: "textarea" },
    { key: "about_me", label: "About Me", type: "textarea", rows: 6 },
    { key: "profile_image", label: "Profile Image URL", type: "url" },
    { key: "contact_email", label: "Contact Email", type: "email" },
    { key: "github_url", label: "GitHub URL", type: "url" },
    { key: "linkedin_url", label: "LinkedIn URL", type: "url" },
  ]

  if (isLoading) {
    return <div className="text-center py-8">Loading settings...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Site Settings</h3>
          <p className="text-sm text-muted-foreground">Configure global site settings and content</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      {message && (
        <Alert className={message.includes("success") ? "border-green-500" : "border-red-500"}>
          <Settings className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {settingsConfig.map((config) => (
          <Card key={config.key} className={config.key === "about_me" ? "md:col-span-2" : ""}>
            <CardHeader>
              <CardTitle className="text-base">{config.label}</CardTitle>
              {config.key === "about_me" && (
                <p className="text-sm text-muted-foreground">
                  This content will appear in the About Me section on your homepage.
                </p>
              )}
              {config.key === "profile_image" && (
                <p className="text-sm text-muted-foreground">
                  This image will appear in the About Me section. Use a square image for best results.
                </p>
              )}
            </CardHeader>
            <CardContent>
              {config.key === "profile_image" ? (
                <ImagePreviewInput
                  value={settings[config.key] || ""}
                  onChange={(value) => handleInputChange(config.key, value)}
                  placeholder="https://example.com/your-profile-image.jpg"
                />
              ) : config.type === "textarea" ? (
                <Textarea
                  value={settings[config.key] || ""}
                  onChange={(e) => handleInputChange(config.key, e.target.value)}
                  rows={config.rows || 3}
                  placeholder={
                    config.key === "about_me" ? "Tell visitors about yourself, your passion, and what you do..." : ""
                  }
                />
              ) : (
                <Input
                  type={config.type}
                  value={settings[config.key] || ""}
                  onChange={(e) => handleInputChange(config.key, e.target.value)}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">💡 Quick Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>
              • <strong>Hero Title:</strong> The main headline on your homepage
            </li>
            <li>
              • <strong>Hero Subtitle:</strong> Supporting text that appears below the title
            </li>
            <li>
              • <strong>About Me:</strong> Personal introduction that appears in the About section
            </li>
            <li>
              • <strong>Profile Image:</strong> Use a square image (400x400px or larger) for best results
            </li>
            <li>
              • <strong>Social URLs:</strong> Links to your professional profiles
            </li>
            <li>• Changes are applied immediately after saving</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
