'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  ExternalLink,
  BookOpen,
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  Microscope,
  Linkedin,
  Twitter,
  Github,
  Instagram,
  Facebook,
  Youtube,
  Globe,
} from 'lucide-react'

interface Member {
  name: string
  slug?: string
  role?: string
  photo?: { url?: string; alt?: string } | null
  bio?: string
  biography?: string
  email?: string
  phone?: string
  office?: string
  researchInterests?: { interest: string }[]
  education?: { degree: string; institution: string; year?: string }[]
  experience?: { position: string; organization: string; duration?: string; expDescription?: string }[]
  awards?: { title: string; year?: string; organization?: string }[]
  courses?: { courseName: string; courseCode?: string; semester?: string; courseDescription?: string }[]
  publications?: { title: string; journal?: string; year?: string; link?: string }[]
  socialLinks?: { platform: string; url: string }[]
  academicLinks?: { platform: string; url: string }[]
}

const socialIcons: Record<string, React.ComponentType<any>> = {
  linkedin: Linkedin,
  'twitter-x': Twitter,
  github: Github,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  google: Globe,
  globe: Globe,
  envelope: Mail,
}

const academicLabels: Record<string, string> = {
  'google-scholar': 'Google Scholar',
  researchgate: 'ResearchGate',
  orcid: 'ORCID',
  academia: 'Academia.edu',
  scopus: 'Scopus',
  wos: 'Web of Science',
  other: 'Link',
}

const HEADING = 'var(--cms-text, #111827)'
const PRIMARY = 'var(--cms-primary, #1E40AF)'
const BORDER = 'var(--cms-muted-bg, #F1F5F9)'
const TEXT = 'var(--cms-text, #111827)'
const ACCENT = 'var(--cms-accent, #F59E0B)'

export default function ProfileClient({ member }: { member: Member }) {
  const photoUrl = typeof member.photo === 'object' && member.photo?.url ? member.photo.url : null

  const tabs = [
    { id: 'about', label: 'About', icon: BookOpen, show: !!(member.biography || member.bio) },
    { id: 'education', label: 'Education', icon: GraduationCap, show: !!member.education?.length },
    {
      id: 'experience',
      label: 'Experience',
      icon: Briefcase,
      show: !!(member.experience?.length || member.awards?.length),
    },
    { id: 'research', label: 'Research', icon: Microscope, show: !!member.researchInterests?.length },
    { id: 'courses', label: 'Courses', icon: BookOpen, show: !!member.courses?.length },
    { id: 'publications', label: 'Publications', icon: FileText, show: !!member.publications?.length },
  ].filter((t) => t.show)

  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'about')

  return (
    <div className="cms-page-shell">
      <div className="mx-auto max-w-7xl px-6 pt-6">
        <Link
          href="/team"
          className="inline-flex items-center gap-2 text-sm font-medium transition-all hover:gap-3"
          style={{ color: PRIMARY }}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Team
        </Link>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[320px_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-[120px] lg:self-start">
          <div className="rounded-2xl border bg-white p-6 text-center" style={{ borderColor: BORDER }}>
            {photoUrl && (
              <div
                className="mx-auto mb-5 h-[180px] w-[180px] overflow-hidden rounded-full border-4"
                style={{ borderColor: BORDER }}
              >
                <Image src={photoUrl} alt={member.name} width={180} height={180} className="h-full w-full object-cover" />
              </div>
            )}
            <h1 className="text-xl font-bold" style={{ color: HEADING }}>
              {member.name}
            </h1>
            {member.role && (
              <p className="mt-1 text-sm font-medium" style={{ color: PRIMARY }}>
                {member.role}
              </p>
            )}
            {member.bio && <p className="mt-3 text-xs text-gray-500">{member.bio}</p>}

            {(member.email || member.phone || member.office) && (
              <div className="mt-5 space-y-3 border-t pt-5 text-left" style={{ borderColor: BORDER }}>
                {member.email && (
                  <a href={`mailto:${member.email}`} className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="h-4 w-4 shrink-0" style={{ color: PRIMARY }} /> {member.email}
                  </a>
                )}
                {member.phone && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="h-4 w-4 shrink-0" style={{ color: PRIMARY }} /> {member.phone}
                  </div>
                )}
                {member.office && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 shrink-0" style={{ color: PRIMARY }} /> {member.office}
                  </div>
                )}
              </div>
            )}

            {member.socialLinks?.length ? (
              <div className="mt-5 flex justify-center gap-2 border-t pt-5" style={{ borderColor: BORDER }}>
                {member.socialLinks.map((link, i) => {
                  const Icon = socialIcons[link.platform] || Globe
                  const url = link.platform === 'envelope' ? `mailto:${link.url}` : link.url
                  return (
                    <a
                      key={i}
                      href={url}
                      target={link.platform === 'envelope' ? undefined : '_blank'}
                      rel="noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-full border"
                      style={{ borderColor: BORDER, color: PRIMARY }}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  )
                })}
              </div>
            ) : null}

            {member.academicLinks?.length ? (
              <div className="mt-4 space-y-2">
                {member.academicLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium"
                    style={{ borderColor: BORDER, color: PRIMARY }}
                  >
                    <ExternalLink className="h-3 w-3" /> {academicLabels[link.platform] || link.platform}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </aside>

        {/* Main */}
        <main>
          {tabs.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold"
                  style={
                    activeTab === tab.id
                      ? { background: PRIMARY, borderColor: PRIMARY, color: '#fff' }
                      : { background: '#fff', borderColor: BORDER, color: TEXT }
                  }
                >
                  <tab.icon className="h-4 w-4" /> {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className="rounded-2xl border bg-white p-8" style={{ borderColor: BORDER }}>
            {activeTab === 'about' && (
              <div>
                <h2 className="mb-4 text-2xl font-bold" style={{ color: HEADING }}>
                  About
                </h2>
                <p className="whitespace-pre-line leading-relaxed text-gray-600">
                  {member.biography || member.bio}
                </p>
              </div>
            )}

            {activeTab === 'education' && member.education && (
              <div>
                <h2 className="mb-6 text-2xl font-bold" style={{ color: HEADING }}>
                  Education
                </h2>
                <div className="space-y-6">
                  {member.education.map((edu, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="mt-1.5 h-3 w-3 shrink-0 rounded-full" style={{ background: PRIMARY }} />
                      <div>
                        <div className="font-semibold" style={{ color: HEADING }}>
                          {edu.degree}
                        </div>
                        <div className="text-sm text-gray-600">{edu.institution}</div>
                        {edu.year && <div className="mt-0.5 text-xs text-gray-400">{edu.year}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div>
                {member.experience?.length ? (
                  <>
                    <h2 className="mb-6 text-2xl font-bold" style={{ color: HEADING }}>
                      Experience
                    </h2>
                    <div className="mb-10 space-y-6">
                      {member.experience.map((exp, i) => (
                        <div key={i} className="border-l-2 pl-5" style={{ borderColor: PRIMARY }}>
                          <div className="font-semibold" style={{ color: HEADING }}>
                            {exp.position}
                          </div>
                          <div className="text-sm text-gray-600">{exp.organization}</div>
                          {exp.duration && <div className="mt-0.5 text-xs text-gray-400">{exp.duration}</div>}
                          {exp.expDescription && <p className="mt-2 text-sm text-gray-500">{exp.expDescription}</p>}
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}
                {member.awards?.length ? (
                  <>
                    <h2 className="mb-4 text-xl font-bold" style={{ color: HEADING }}>
                      Awards &amp; Honors
                    </h2>
                    <div className="space-y-3">
                      {member.awards.map((award, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <Award className="mt-0.5 h-5 w-5 shrink-0" style={{ color: ACCENT }} />
                          <div>
                            <div className="font-medium" style={{ color: HEADING }}>
                              {award.title}
                            </div>
                            <div className="text-xs text-gray-400">
                              {[award.organization, award.year].filter(Boolean).join(' · ')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            )}

            {activeTab === 'research' && member.researchInterests && (
              <div>
                <h2 className="mb-6 text-2xl font-bold" style={{ color: HEADING }}>
                  Research Interests
                </h2>
                <div className="flex flex-wrap gap-2">
                  {member.researchInterests.map((r, i) => (
                    <span
                      key={i}
                      className="rounded-full px-4 py-2 text-sm"
                      style={{ background: BORDER, color: TEXT }}
                    >
                      {r.interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'courses' && member.courses && (
              <div>
                <h2 className="mb-6 text-2xl font-bold" style={{ color: HEADING }}>
                  Courses
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {member.courses.map((c, i) => (
                    <div key={i} className="rounded-xl border p-5" style={{ borderColor: BORDER }}>
                      <div className="font-semibold" style={{ color: HEADING }}>
                        {c.courseName}
                      </div>
                      {c.courseCode && (
                        <div className="mt-0.5 text-xs text-gray-400">
                          {c.courseCode}
                          {c.semester ? ` · ${c.semester}` : ''}
                        </div>
                      )}
                      {c.courseDescription && <p className="mt-2 text-sm text-gray-500">{c.courseDescription}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'publications' && member.publications && (
              <div>
                <h2 className="mb-6 text-2xl font-bold" style={{ color: HEADING }}>
                  Publications
                </h2>
                <div className="space-y-4">
                  {member.publications.map((pub, i) => (
                    <div key={i} className="border-b pb-4" style={{ borderColor: BORDER }}>
                      {pub.link ? (
                        <a
                          href={pub.link}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium hover:underline"
                          style={{ color: PRIMARY }}
                        >
                          {pub.title}
                        </a>
                      ) : (
                        <div className="font-medium" style={{ color: HEADING }}>
                          {pub.title}
                        </div>
                      )}
                      <div className="mt-0.5 text-xs text-gray-400">
                        {[pub.journal, pub.year].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
