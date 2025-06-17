"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { submitContactForm, type ContactFormData } from "@/app/actions/contact"
import { Mail, Send, CheckCircle, AlertCircle, Loader2, User, MessageSquare } from "lucide-react"

export function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{
    success: boolean
    message: string
    errors?: Record<string, string[]>
  } | null>(null)
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setResult(null)

    const form = event.currentTarget
    const formDataObj = new FormData(form)

    startTransition(async () => {
      const result = await submitContactForm(formDataObj)
      setResult(result)

      if (result.success) {
        // Reset form on success
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        })
        form.reset()

        // Scroll to success message
        setTimeout(() => {
          const alertElement = document.querySelector("[data-success-alert]")
          if (alertElement) {
            alertElement.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        }, 100)
      }
    })
  }

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear previous results when user starts typing
    if (result) {
      setResult(null)
    }
  }

  const getFieldError = (field: keyof ContactFormData) => {
    return result?.errors?.[field]?.[0]
  }

  const isFieldInvalid = (field: keyof ContactFormData) => {
    return !!getFieldError(field)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Get In Touch</h3>
          <p className="text-muted-foreground">Have a project in mind? Let's discuss how we can work together.</p>
        </div>

        {/* Success/Error Alert */}
        {result && (
          <Alert
            data-success-alert={result.success}
            className={`mb-6 ${
              result.success
                ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                : "border-red-500 bg-red-50 dark:bg-red-950/30"
            }`}
          >
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              )}
              <AlertDescription
                className={result.success ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}
              >
                {result.message}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name and Email Row */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`transition-all duration-300 ${
                  isFieldInvalid("name") ? "border-red-500 focus:border-red-500" : "focus:border-primary"
                }`}
                required
                disabled={isPending}
                maxLength={100}
              />
              {getFieldError("name") && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {getFieldError("name")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`transition-all duration-300 ${
                  isFieldInvalid("email") ? "border-red-500 focus:border-red-500" : "focus:border-primary"
                }`}
                required
                disabled={isPending}
              />
              {getFieldError("email") && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {getFieldError("email")}
                </p>
              )}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Subject *
            </Label>
            <Input
              id="subject"
              name="subject"
              type="text"
              placeholder="Project Inquiry / Collaboration / Question"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              className={`transition-all duration-300 ${
                isFieldInvalid("subject") ? "border-red-500 focus:border-red-500" : "focus:border-primary"
              }`}
              required
              disabled={isPending}
              maxLength={200}
            />
            {getFieldError("subject") && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {getFieldError("subject")}
              </p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Message *
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell me about your project, timeline, budget, and any specific requirements. The more details you provide, the better I can help you!"
              rows={6}
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              className={`transition-all duration-300 resize-none ${
                isFieldInvalid("message") ? "border-red-500 focus:border-red-500" : "focus:border-primary"
              }`}
              required
              disabled={isPending}
              maxLength={2000}
            />
            <div className="flex justify-between items-center">
              {getFieldError("message") ? (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {getFieldError("message")}
                </p>
              ) : (
                <div />
              )}
              <p className="text-xs text-muted-foreground">{formData.message.length}/2000</p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 py-3 text-lg font-semibold"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending Message...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </>
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Prefer email? Reach me directly at{" "}
            <a href="mailto:ovibenz@gmail.com" className="text-primary hover:underline font-medium transition-colors">
              ovibenz@gmail.com
            </a>
          </p>
          <p className="text-xs text-muted-foreground mt-2">I typically respond within 24 hours</p>
        </div>
      </div>
    </div>
  )
}
