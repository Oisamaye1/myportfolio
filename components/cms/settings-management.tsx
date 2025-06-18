"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Settings, Globe, Share2, User } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImagePreviewInput } from "./image-preview-input"
import { Separator } from "@/components/ui/separator"

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
        setMessage("Settings saved successfully! Please refresh your website to see changes.")
        setTimeout(() => setMessage(""), 5000)
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

  // Site Configuration Settings
  const siteConfigSettings = [
    { key: "site_name", label: "Site Name", type: "text", placeholder: "Oisamaye" },
    { key: "site_title", label: "Site Title (Browser Tab)", type: "text", placeholder: "Oisamaye's Portfolio" },
    {
      key: "site_description",
      label: "Site Description",
      type: "textarea",
      placeholder: "A passionate Web Developer building beautiful and functional web experiences.",
    },
    { key: "site_url", label: "Site URL", type: "url", placeholder: "https://oisamaye.vercel.app/" },
    { key: "og_image", label: "Open Graph Image URL", type: "url", placeholder: "https://example.com/og-image.jpg" },
    { key: "site_creator", label: "Creator Name", type: "text", placeholder: "Ovioisa Oisamaye Benjamin" },
    { key: "twitter_handle", label: "Twitter Handle", type: "text", placeholder: "@ovioisabenjamin" },
  ]

  // Content Settings
  const contentSettings = [
    { key: "hero_title", label: "Hero Title", type: "text", placeholder: "Welcome to my portfolio" },
    { key: "hero_subtitle", label: "Hero Subtitle", type: "textarea", placeholder: "I'm a passionate developer..." },
    { key: "about_me", label: "About Me", type: "textarea", rows: 6, placeholder: "Tell visitors about yourself..." },
    { key: "profile_image", label: "Profile Image URL", type: "url", placeholder: "https://example.com/profile.jpg" },
    { key: "contact_email", label: "Contact Email", type: "email", placeholder: "your@email.com" },
  ]

  // Social Links Settings
  const socialSettings = [
    { key: "github_url", label: "GitHub URL", type: "url", placeholder: "https://github.com/yourusername" },
    { key: "linkedin_url", label: "LinkedIn URL", type: "url", placeholder: "https://linkedin.com/in/yourprofile" },
    { key: "twitter_url", label: "Twitter URL", type: "url", placeholder: "https://twitter.com/yourhandle" },
  ]

  // SEO Keywords (as comma-separated string)
  const seoSettings = [
    {
      key: "seo_keywords",
      label: "SEO Keywords",
      type: "textarea",
      placeholder: "web developer, frontend developer, react developer, next.js developer, portfolio",
    },
  ]

  if (isLoading) {
    return <div className="text-center py-8">Loading settings...</div>
  }

  const renderSettingField = (config: any) => {
    if (config.key === "profile_image" || config.key === "og_image") {
      return (
        <ImagePreviewInput
          value={settings[config.key] || ""}
          onChange={(value) => handleInputChange(config.key, value)}
          placeholder={config.placeholder}
        />
      )
    } else if (config.type === "textarea") {
      return (
        <Textarea
          value={settings[config.key] || ""}
          onChange={(e) => handleInputChange(config.key, e.target.value)}
          rows={config.rows || 3}
          placeholder={config.placeholder}
        />
      )
    } else {
      return (
        <Input
          type={config.type}
          value={settings[config.key] || ""}
          onChange={(e) => handleInputChange(config.key, e.target.value)}
          placeholder={config.placeholder}
        />
      )
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Site Configuration</h3>
          <p className="text-sm text-muted-foreground">Configure your website settings, content, and SEO</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save All Settings"}
        </Button>
      </div>

      {message && (
        <Alert className={message.includes("success") ? "border-green-500" : "border-red-500"}>
          <Settings className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Site Configuration Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          <h4 className="text-lg font-medium">Site Configuration</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          These settings control your website's basic information, SEO, and how it appears when shared on social media.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {siteConfigSettings.map((config) => (
            <Card key={config.key}>
              <CardHeader>
                <CardTitle className="text-base">{config.label}</CardTitle>
                {config.key === "site_title" && (
                  <p className="text-sm text-muted-foreground">This appears in the browser tab and search results.</p>
                )}
                {config.key === "og_image" && (
                  <p className="text-sm text-muted-foreground">
                    Image shown when your site is shared on social media (1200x630px recommended).
                  </p>
                )}
              </CardHeader>
              <CardContent>{renderSettingField(config)}</CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Content Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <h4 className="text-lg font-medium">Content & Profile</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage your personal content, hero section, and profile information.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {contentSettings.map((config) => (
            <Card key={config.key} className={config.key === "about_me" ? "md:col-span-2" : ""}>
              <CardHeader>
                <CardTitle className="text-base">{config.label}</CardTitle>
                {config.key === "about_me" && (
                  <p className="text-sm text-muted-foreground">
                    This content appears in the About Me section on your homepage.
                  </p>
                )}
                {config.key === "profile_image" && (
                  <p className="text-sm text-muted-foreground">Square image recommended (400x400px or larger).</p>
                )}
              </CardHeader>
              <CardContent>{renderSettingField(config)}</CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Social Links Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          <h4 className="text-lg font-medium">Social Media Links</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Add your social media profiles. These will appear in your navigation and footer.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {socialSettings.map((config) => (
            <Card key={config.key}>
              <CardHeader>
                <CardTitle className="text-base">{config.label}</CardTitle>
              </CardHeader>
              <CardContent>{renderSettingField(config)}</CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* SEO Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <h4 className="text-lg font-medium">SEO Settings</h4>
        </div>
        <p className="text-sm text-muted-foreground">Optimize your website for search engines.</p>
        <div className="grid gap-6">
          {seoSettings.map((config) => (
            <Card key={config.key}>
              <CardHeader>
                <CardTitle className="text-base">{config.label}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Enter keywords separated by commas. These help search engines understand your content.
                </p>
              </CardHeader>
              <CardContent>{renderSettingField(config)}</CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">💡 Configuration Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h5 className="font-medium mb-2">Site Configuration</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • <strong>Site Name:</strong> Your brand/personal name
                </li>
                <li>
                  • <strong>Site Title:</strong> What appears in browser tabs
                </li>
                <li>
                  • <strong>Description:</strong> Brief summary for search engines
                </li>
                <li>
                  • <strong>OG Image:</strong> Image for social media shares
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2">Best Practices</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Keep descriptions under 160 characters</li>
                <li>• Use high-quality images (1200x630px for OG)</li>
                <li>• Include relevant keywords naturally</li>
                <li>• Test social sharing after changes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
