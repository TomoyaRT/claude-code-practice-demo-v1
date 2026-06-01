import { NextRequest, NextResponse } from "next/server"
import { contactSchema } from "@/lib/validations"
import { sendContactEmail } from "@/services/email.service"

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX = 5

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) return false

  entry.count++
  return true
}

function getClientIp(request: NextRequest): string {
  // x-real-ip is set by Vercel/Nginx and is not spoofable by the client
  const realIp = request.headers.get("x-real-ip")
  if (realIp) return realIp.trim()

  // x-forwarded-for: take the last (rightmost) entry which is set by a trusted proxy
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    const parts = forwarded.split(",")
    return parts[parts.length - 1]?.trim() ?? "unknown"
  }

  return "unknown"
}

// Handle CORS preflight
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin":  process.env.NEXT_PUBLIC_SITE_URL ?? "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age":       "86400",
    },
  })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Content-Type check
    const contentType = request.headers.get("content-type") ?? ""
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json", code: "UNSUPPORTED_MEDIA_TYPE" },
        { status: 415 }
      )
    }

    // Rate limiting
    const ip = getClientIp(request)
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later.", code: "RATE_LIMITED" },
        { status: 429 }
      )
    }

    // Parse body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid request body.", code: "INVALID_JSON" },
        { status: 400 }
      )
    }

    // Validate
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
