"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { contactSchema, type ContactFormData } from "@/lib/validations"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

type FormState = "idle" | "submitting" | "success" | "error"

interface FieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

function Field({ label, error, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-xs tracking-[0.15em] uppercase text-[--color-text-muted]">
        {label}
        {required && <span className="text-[--color-accent] ml-1" aria-hidden="true">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-[--color-accent-2] font-mono"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

const inputClass = cn(
  "w-full bg-[--color-bg-card] text-[--color-text]",
  "border border-[--color-border] rounded-lg",
  "px-4 py-3 text-sm",
  "font-[family-name:--font-body]",
  "placeholder:text-[--color-text-faint]",
  "transition-[border-color,box-shadow] duration-150",
  "focus:outline-none focus:border-[--color-accent]",
  "focus:shadow-[0_0_0_3px_rgba(100,255,218,0.1)]",
  "disabled:opacity-50 disabled:cursor-not-allowed",
  "aria-[invalid=true]:border-[--color-accent-2]"
)

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const shouldReduceMotion = useReducedMotion()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setFormState("submitting")
    setErrorMessage("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const json: unknown = await res.json()

      if (!res.ok) {
        const errorJson = json as { error?: string }
        setErrorMessage(errorJson.error ?? "Something went wrong. Please try again.")
        setFormState("error")
        return
      }

      setFormState("success")
      reset()
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.")
      setFormState("error")
    }
  }

  if (formState === "success") {
    return (
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center gap-4 py-16 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-[--color-accent-dim] flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path
              d="M6 16l7 7L26 9"
              stroke="var(--color-accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="font-[family-name:--font-heading] text-2xl font-bold text-[--color-text]">
          Message Sent
        </h3>
        <p className="text-[--color-text-muted] max-w-sm">
          Thanks for reaching out. I&apos;ll get back to you within 1–2 business days.
        </p>
        <button
          onClick={() => setFormState("idle")}
          className="font-mono text-sm text-[--color-text-muted] hover:text-[--color-accent] transition-colors duration-150 underline underline-offset-4 mt-2"
        >
          Send another message
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Name" error={errors.name?.message} required>
          <input
            {...register("name")}
            type="text"
            placeholder="Your name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            disabled={isSubmitting}
            className={inputClass}
          />
        </Field>
        <Field label="Email" error={errors.email?.message} required>
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            disabled={isSubmitting}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Subject" error={errors.subject?.message} required>
        <input
          {...register("subject")}
          type="text"
          placeholder="What's this about?"
          aria-invalid={!!errors.subject}
          disabled={isSubmitting}
          className={inputClass}
        />
      </Field>

      <Field label="Message" error={errors.message?.message} required>
        <textarea
          {...register("message")}
          rows={6}
          placeholder="Tell me about your project…"
          aria-invalid={!!errors.message}
          disabled={isSubmitting}
          className={cn(inputClass, "resize-none")}
        />
      </Field>

      <AnimatePresence>
        {formState === "error" && errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 p-4 rounded-lg bg-[--color-accent-2-dim] border border-[--color-accent-2] text-sm text-[--color-accent-2]"
            role="alert"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5" aria-hidden="true">
              <path d="M8 1L15 14H1L8 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M8 6v4M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isSubmitting}
        className="w-full sm:w-auto sm:self-start"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" strokeLinecap="round"/>
            </svg>
            Sending…
          </span>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  )
}
