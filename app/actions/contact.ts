"use server"

import { z } from "zod"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200, "Subject is too long"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message is too long"),
})

export type ContactFormData = z.infer<typeof contactSchema>

export async function submitContactForm(formData: FormData) {
  console.log("📧 Processing contact form submission...")

  // Add a small delay to show loading state
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    subject: formData.get("subject") as string,
    message: formData.get("message") as string,
  }

  try {
    // Validate the data
    const validatedData = contactSchema.parse(data)

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn("⚠️ Resend API key not configured")
      // Still return success for demo purposes
      return {
        success: true,
        message: "Thank you for your message! I'll get back to you soon. (Demo mode - email not actually sent)",
      }
    }

    try {
      // Send email using Resend
      const { data: emailData, error } = await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [process.env.CONTACT_EMAIL || "contact@example.com"],
        subject: `New Contact: ${validatedData.subject}`,
        replyTo: validatedData.email,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; border-bottom: 2px solid #ffb400; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #555; margin-top: 0;">Contact Details</h3>
              <p><strong>Name:</strong> ${validatedData.name}</p>
              <p><strong>Email:</strong> ${validatedData.email}</p>
              <p><strong>Subject:</strong> ${validatedData.subject}</p>
            </div>
            
            <div style="background-color: #fff; padding: 20px; border-left: 4px solid #ffb400; margin: 20px 0;">
              <h3 style="color: #555; margin-top: 0;">Message</h3>
              <p style="line-height: 1.6; white-space: pre-wrap;">${validatedData.message}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
              <p>This email was sent from your portfolio website contact form.</p>
              <p>Reply directly to this email to respond to ${validatedData.name}.</p>
            </div>
          </div>
        `,
      })

      if (error) {
        console.error("❌ Resend API error:", error)
        return {
          success: false,
          message: "Failed to send your message. Please try again later or contact me directly.",
        }
      }

      console.log("✅ Email sent successfully:", emailData)
      return {
        success: true,
        message: "Thank you for your message! I'll get back to you within 24 hours.",
      }
    } catch (emailError) {
      console.error("❌ Email sending error:", emailError)
      return {
        success: false,
        message: "There was an issue sending your message. Please try again or contact me directly.",
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Validation error:", error)
      return {
        success: false,
        message: "Please check your form data and try again.",
        errors: error.flatten().fieldErrors,
      }
    }

    console.error("❌ Unexpected error:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    }
  }
}
