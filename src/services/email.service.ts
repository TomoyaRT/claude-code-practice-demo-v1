import { Resend } from "resend"
import type { ContactFormData } from "@/lib/validations"

const FROM_EMAIL = "onboarding@resend.dev"
const TO_EMAIL   = process.env.CONTACT_EMAIL ?? "worth22focus3000@gmail.com"

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set")
  }
  return new Resend(apiKey)
}

async function sendEmail(data: ContactFormData): Promise<EmailResult> {
  const resend = getResendClient()

  const { data: result, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to:   TO_EMAIL,
    replyTo: data.email,
    subject: `[Portfolio Contact] ${data.subject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #64FFDA; border-bottom: 1px solid #1E2A3A; padding-bottom: 12px;">
          New Contact Form Submission
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #8892B0; width: 100px;">Name</td>
            <td style="padding: 8px; color: #CCD6F6;">${escapeHtml(data.name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #8892B0;">Email</td>
            <td style="padding: 8px; color: #CCD6F6;">${escapeHtml(data.email)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #8892B0;">Subject</td>
            <td style="padding: 8px; color: #CCD6F6;">${escapeHtml(data.subject)}</td>
          </tr>
        </table>
        <div style="margin-top: 16px; padding: 16px; background: #0E1420; border-radius: 8px; border-left: 3px solid #64FFDA;">
          <p style="font-weight: bold; color: #8892B0; margin-bottom: 8px;">Message</p>
          <p style="color: #CCD6F6; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
        </div>
      </div>
    `,
    text: `Name: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\n\nMessage:\n${data.message}`,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, messageId: result?.id }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export async function sendContactEmail(data: ContactFormData): Promise<EmailResult> {
  const result = await sendEmail(data)

  if (!result.success) {
    // Retry once on failure
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return sendEmail(data)
  }

  return result
}
