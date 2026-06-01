import { NextRequest, NextResponse } from "next/server"
import { contactSchema } from "@/lib/validations"
import { sendContactEmail } from "@/services/email.service"

// Simple in-memory rate limiter (resets on server restart — good enough for MVP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 5 // 5 submissions per hour per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false
  }

  entry.count++
  return true
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Rate limiting
    const forwardedFor = request.headers.get("x-forwarded-for")
    const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown"

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later.", code: "RATE_LIMITED" },
        { status: 429 }
      )
    }

    // Parse and validate body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid request body.", code: "INVALID_JSON" },
        { status: 400 }
      )
    }

    const result = contactSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          code: "VALIDATION_ERROR",
          details: result.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 }
      )
    }

    // Send email
    const emailResult = await sendContactEmail(result.data)

    if (!emailResult.success) {
      console.error("Email send failed:", emailResult.error)
      return NextResponse.json(
        { error: "Failed to send message. Please try again.", code: "EMAIL_ERROR" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: { messageId: emailResult.messageId }, message: "Message sent successfully!" },
      { status: 200 }
    )
  } catch (err) {
    console.error("Contact API error:", err)
    return NextResponse.json(
      { error: "An unexpected error occurred.", code: "INTERNAL_ERROR" },
      { status: 500 }
    )
  }
}
