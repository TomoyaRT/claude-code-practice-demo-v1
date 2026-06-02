import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans, DM_Mono } from "next/font/google"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { CustomCursor } from "@/components/ui/CustomCursor"
import { FireflyCursor } from "@/components/ui/FireflyCursor"
import { PageTransition } from "@/components/layout/PageTransition"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
})

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Tomoya — Software Freelancer",
    template: "%s | Tomoya",
  },
  description:
    "Software freelancer specializing in full-stack web development, AI integrations, and high-performance web applications.",
  keywords: ["freelancer", "web development", "Next.js", "TypeScript", "React", "full-stack"],
  authors: [{ name: "Tomoya" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Tomoya — Software Freelancer",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body className="min-h-screen bg-[--color-bg] text-[--color-text] antialiased flex flex-col">
        <CustomCursor />
        <FireflyCursor />
        <Header />
        <main className="flex-1 pt-20">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  )
}
