'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import RichText from '../ui/RichText'
import DynamicIcon from '../ui/DynamicIcon'
import ScrollReveal from '../ui/ScrollReveal'
import { Send, ChevronDown } from 'lucide-react'

// ── Types ──

type FormField = {
  id?: string
  blockType: string
  name?: string
  label?: string
  required?: boolean
  width?: number
  defaultValue?: string | boolean | number
  options?: Array<{ label: string; value: string }>
  placeholder?: string
  message?: unknown
}

type FormDoc = {
  id: string | number
  title?: string
  fields?: FormField[]
  submitButtonLabel?: string
  confirmationType?: 'message' | 'redirect'
  confirmationMessage?: unknown
  redirect?: { url?: string }
}

interface ContactItem {
  icon?: string | null
  label: string
  value: string
  iconColor?: string | null
}

interface LogoItem {
  image?: any
  alt?: string | null
}

interface ContactSectionBlockProps {
  layout?: 'modern' | 'classic' | 'centered' | 'formOnly' | null
  sectionHeading?: any
  sectionDescription?: any
  contactItems?: ContactItem[]
  logos?: LogoItem[]
  organizationName?: string | null
  organizationDetails?: string | null
  form?: unknown
  submitButtonLabel?: string | null
  backgroundColor?: string | null
  buttonColor?: string | null
}

// ── Helpers ──

function getFormId(form: unknown): string | null {
  if (!form) return null
  if (typeof form === 'string' || typeof form === 'number') return String(form)
  if (typeof form === 'object' && form !== null && 'id' in form) {
    const id = (form as { id?: string | number }).id
    return typeof id === 'string' || typeof id === 'number' ? String(id) : null
  }
  return null
}

function isLexicalData(value: unknown): value is { root: unknown } {
  return typeof value === 'object' && value !== null && 'root' in value
}

function hasRichContent(data: any): boolean {
  return data?.root?.children?.length > 0
}

// ── Modern Styled Form ──

function ModernForm({
  form,
  submitLabel,
  buttonColor,
}: {
  form: unknown
  submitLabel?: string | null
  buttonColor?: string | null
}) {
  const formId = getFormId(form)
  const initialFormDoc =
    typeof form === 'object' && form !== null && 'fields' in (form as object)
      ? (form as FormDoc)
      : null

  const [formDoc, setFormDoc] = useState<FormDoc | null>(initialFormDoc)
  const [loading, setLoading] = useState(!initialFormDoc && !!formId)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (initialFormDoc || !formId) return
    let active = true
    async function loadForm() {
      try {
        setLoading(true)
        const res = await fetch(`/api/forms/${formId}`, { credentials: 'same-origin' })
        if (!res.ok) throw new Error('Failed to load form')
        const data = await res.json()
        if (active) setFormDoc(data)
      } catch {
        if (active) setError('Unable to load form.')
      } finally {
        if (active) setLoading(false)
      }
    }
    void loadForm()
    return () => { active = false }
  }, [formId, initialFormDoc])

  const fields = useMemo(() => formDoc?.fields || [], [formDoc])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!formDoc?.id) return
    const fd = new FormData(e.currentTarget)
    const submissionData = Array.from(fd.entries())
      .filter(([field]) => field !== '')
      .map(([field, value]) => ({ field, value: String(value) }))

    try {
      setSubmitting(true)
      setError(null)
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: String(formDoc.id), submissionData }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || 'Submission failed')
      }
      if (formDoc.confirmationType === 'redirect' && formDoc.redirect?.url) {
        window.location.href = formDoc.redirect.url
        return
      }
      setSuccess(true)
      ;(e.target as HTMLFormElement).reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!formId) return null
  if (loading) return <div className="text-sm text-slate-400">Loading form...</div>
  if (error && !formDoc) return <div className="text-sm text-red-500">{error}</div>
  if (!formDoc) return null

  const btnLabel = submitLabel || formDoc.submitButtonLabel || 'Send Message'

  if (success && formDoc.confirmationType === 'message' && formDoc.confirmationMessage) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-2xl shadow-blue-500/5">
        {isLexicalData(formDoc.confirmationMessage) ? (
          <RichText data={formDoc.confirmationMessage as any} />
        ) : (
          <p className="text-green-600 font-semibold">Thank you! Your message has been sent.</p>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-[2.5rem] bg-white p-4 shadow-2xl shadow-blue-500/5">
      <div className="p-8">
        <form onSubmit={handleSubmit}>
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {fields.map((field, index) => renderField(field, index))}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="group flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-lg font-semibold text-white shadow-xl transition-all hover:shadow-2xl disabled:opacity-60"
            style={{ backgroundColor: buttonColor || '#3B82F6' }}
          >
            {submitting ? 'Sending...' : btnLabel}
            <Send className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Field Renderer (modern styled, handles any field type) ──

function renderField(field: FormField, index: number) {
  const key = field.id || `${field.blockType}-${field.name || index}`
  const name = field.name || ''
  const label = field.label || name
  const isFullWidth =
    field.blockType === 'textarea' ||
    field.blockType === 'message' ||
    field.blockType === 'checkbox' ||
    field.width === 100

  const wrapperClass = isFullWidth ? 'md:col-span-2' : ''

  // Message block
  if (field.blockType === 'message') {
    if (!isLexicalData(field.message)) return null
    return (
      <div key={key} className="md:col-span-2">
        <RichText data={field.message as any} />
      </div>
    )
  }

  if (!name) return null

  // Textarea
  if (field.blockType === 'textarea') {
    return (
      <div key={key} className={wrapperClass}>
        <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {label}{field.required && <span className="text-red-400"> *</span>}
        </label>
        <textarea
          name={name}
          required={!!field.required}
          placeholder={field.placeholder || ''}
          defaultValue={typeof field.defaultValue === 'string' ? field.defaultValue : ''}
          className="min-h-[120px] w-full resize-y rounded-xl border-none bg-slate-100/60 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
    )
  }

  // Select
  if (field.blockType === 'select') {
    return (
      <div key={key} className={wrapperClass}>
        <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {label}{field.required && <span className="text-red-400"> *</span>}
        </label>
        <div className="relative">
          <select
            name={name}
            required={!!field.required}
            defaultValue={typeof field.defaultValue === 'string' ? field.defaultValue : ''}
            className="h-12 w-full appearance-none rounded-xl border-none bg-slate-100/60 px-4 pr-10 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">{field.placeholder || 'Select an option'}</option>
            {(field.options || []).map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>
    )
  }

  // Radio
  if (field.blockType === 'radio') {
    return (
      <fieldset key={key} className={wrapperClass}>
        <legend className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {label}{field.required && <span className="text-red-400"> *</span>}
        </legend>
        <div className="flex flex-wrap gap-4">
          {(field.options || []).map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="radio" name={name} value={opt.value} required={!!field.required} className="accent-blue-600" />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>
    )
  }

  // Checkbox
  if (field.blockType === 'checkbox') {
    return (
      <div key={key} className="md:col-span-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name={name}
            value="true"
            defaultChecked={!!field.defaultValue}
            required={!!field.required}
            className="h-5 w-5 rounded accent-blue-600"
          />
          <span className="text-sm font-medium text-slate-700">
            {label}{field.required && <span className="text-red-400"> *</span>}
          </span>
        </label>
      </div>
    )
  }

  // Default: text, email, number, date, etc.
  const inputType =
    field.blockType === 'email' ? 'email' :
    field.blockType === 'number' ? 'number' :
    field.blockType === 'date' ? 'date' : 'text'

  return (
    <div key={key} className={wrapperClass}>
      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {label}{field.required && <span className="text-red-400"> *</span>}
      </label>
      <input
        type={inputType}
        name={name}
        required={!!field.required}
        placeholder={field.placeholder || ''}
        defaultValue={
          typeof field.defaultValue === 'string' || typeof field.defaultValue === 'number'
            ? String(field.defaultValue) : ''
        }
        className="h-12 w-full rounded-xl border-none bg-slate-100/60 px-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  )
}

// ── Layout Components ──

function ContactInfoCards({ items }: { items: ContactItem[] }) {
  return (
    <div className="space-y-8">
      {items.map((item, i) => (
        <div key={i} className="flex gap-6">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${item.iconColor || '#3B82F6'}15` }}
          >
            {item.icon ? (
              <DynamicIcon name={item.icon} size={24} color={item.iconColor || '#3B82F6'} />
            ) : (
              <div className="h-6 w-6 rounded-full" style={{ backgroundColor: item.iconColor || '#3B82F6' }} />
            )}
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">{item.label}</h4>
            <p className="text-sm leading-relaxed text-slate-500">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function ClassicLeftPanel({ logos, orgName, orgDetails }: { logos?: LogoItem[]; orgName?: string | null; orgDetails?: string | null }) {
  return (
    <div className="flex flex-col items-center text-center">
      {logos && logos.length > 0 && (
        <div className="mb-6 flex items-center justify-center gap-6">
          {logos.map((logo, i) => {
            const url = typeof logo.image === 'object' && logo.image?.url ? logo.image.url : null
            if (!url) return null
            return (
              <div key={i} className="relative h-24 w-24">
                <Image src={url} alt={logo.alt || 'Logo'} fill className="object-contain" />
              </div>
            )
          })}
        </div>
      )}
      {orgName && <h3 className="text-xl font-bold text-slate-900 mb-2">{orgName}</h3>}
      {orgDetails && <p className="text-sm leading-relaxed text-slate-500 whitespace-pre-line">{orgDetails}</p>}
    </div>
  )
}

// ── Main Component ──

export default function ContactSectionBlock(props: ContactSectionBlockProps) {
  const {
    layout = 'modern',
    sectionHeading,
    sectionDescription,
    contactItems,
    logos,
    organizationName,
    organizationDetails,
    form,
    submitButtonLabel,
    backgroundColor,
    buttonColor,
  } = props

  const style = layout || 'modern'
  const hasHeading = hasRichContent(sectionHeading)
  const hasDescription = hasRichContent(sectionDescription)

  // Form Only
  if (style === 'formOnly') {
    return (
      <section className="py-24 px-6" style={{ backgroundColor: backgroundColor || '#ffffff' }}>
        <div className="mx-auto max-w-2xl">
          <ModernForm form={form} submitLabel={submitButtonLabel} buttonColor={buttonColor} />
        </div>
      </section>
    )
  }

  // Centered
  if (style === 'centered') {
    return (
      <section className="py-24 px-6" style={{ backgroundColor: backgroundColor || '#ffffff' }}>
        <div className="mx-auto max-w-7xl">
          {(hasHeading || hasDescription) && (
            <div className="mx-auto mb-16 max-w-3xl text-center">
              {hasHeading && <RichText data={sectionHeading} />}
              {hasDescription && <RichText data={sectionDescription} className="mt-4 text-lg text-slate-500 leading-relaxed" />}
            </div>
          )}
          <div className="grid gap-16 lg:grid-cols-2 items-start">
            <div>
              {contactItems && contactItems.length > 0 && <ContactInfoCards items={contactItems} />}
            </div>
            <ModernForm form={form} submitLabel={submitButtonLabel} buttonColor={buttonColor} />
          </div>
        </div>
      </section>
    )
  }

  // Classic
  if (style === 'classic') {
    return (
      <section className="py-24 px-6" style={{ backgroundColor: backgroundColor || '#ffffff' }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <ScrollReveal>
              <div>
                {(hasHeading || hasDescription) && (
                  <div className="mb-10">
                    {hasHeading && <RichText data={sectionHeading} />}
                    {hasDescription && <RichText data={sectionDescription} className="mt-4 text-lg text-slate-500 leading-relaxed" />}
                  </div>
                )}
                <ClassicLeftPanel logos={logos} orgName={organizationName} orgDetails={organizationDetails} />
              </div>
            </ScrollReveal>
            <ScrollReveal>
              <ModernForm form={form} submitLabel={submitButtonLabel} buttonColor={buttonColor} />
            </ScrollReveal>
          </div>
        </div>
      </section>
    )
  }

  // Modern (default)
  return (
    <section className="py-24 px-6" style={{ backgroundColor: backgroundColor || '#ffffff' }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          <ScrollReveal>
            <div>
              {hasHeading && (
                <div className="mb-6">
                  <RichText data={sectionHeading} />
                </div>
              )}
              {hasDescription && (
                <div className="mb-10">
                  <RichText data={sectionDescription} className="text-lg text-slate-500 leading-relaxed" />
                </div>
              )}
              {contactItems && contactItems.length > 0 && <ContactInfoCards items={contactItems} />}
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <ModernForm form={form} submitLabel={submitButtonLabel} buttonColor={buttonColor} />
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
