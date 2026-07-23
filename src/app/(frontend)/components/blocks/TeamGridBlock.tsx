import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Linkedin,
  Twitter,
  Github,
  Instagram,
  Facebook,
  Youtube,
  Globe,
  Mail,
} from 'lucide-react'
import type { Media as MediaType } from '@/payload-types'
import SectionHeading from '../ui/SectionHeading'

interface SocialLink {
  platform: string
  url: string
  id?: string | null
}

interface Member {
  name: string
  slug?: string | null
  role?: string | null
  photo?: MediaType | string | null
  bio?: string | null
  profileLink?: string | null
  socialLinks?: SocialLink[] | null
  id?: string | null
}

interface TeamGridBlockProps {
  sectionHeading?: string | null
  sectionDescription?: string | null
  headingAlignment?: 'left' | 'center' | 'right' | null
  columns?: '2' | '3' | '4' | null
  showSocialLinks?: boolean | null
  members: Member[]
}

const gridClasses: Record<string, string> = {
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
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

function slugify(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function TeamGridBlock({
  sectionHeading,
  sectionDescription,
  headingAlignment,
  columns = '3',
  showSocialLinks = true,
  members,
}: TeamGridBlockProps) {
  const cols = columns || '3'
  if (!members?.length) return null

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading heading={sectionHeading} description={sectionDescription} alignment={headingAlignment} />
        <div className={`grid gap-6 ${gridClasses[cols]}`}>
          {members.map((member, i) => {
            const photoUrl = typeof member.photo === 'object' && member.photo?.url ? member.photo.url : null
            const href = member.profileLink || `/goa/team/${member.slug || slugify(member.name)}`
            const social = showSocialLinks !== false ? member.socialLinks || [] : []

            return (
              <div
                key={member.id || i}
                className="group flex flex-col overflow-hidden rounded-2xl border bg-white text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ borderColor: 'var(--cms-muted-bg, #F1F5F9)' }}
              >
                <Link href={href} className="block">
                  {photoUrl && (
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={photoUrl}
                        alt={member.name}
                        width={400}
                        height={400}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-bold" style={{ color: 'var(--cms-text, #111827)' }}>
                      {member.name}
                    </h3>
                    {member.role && (
                      <p className="mt-1 text-sm font-medium" style={{ color: 'var(--cms-primary, #1E40AF)' }}>
                        {member.role}
                      </p>
                    )}
                    {member.bio && <p className="mt-2 line-clamp-2 text-xs text-slate-500">{member.bio}</p>}
                  </div>
                </Link>

                {social.length > 0 && (
                  <div
                    className="mt-auto flex items-center justify-center gap-2 border-t px-5 py-4"
                    style={{ borderColor: 'var(--cms-muted-bg, #F1F5F9)' }}
                  >
                    {social.map((link, j) => {
                      const Icon = socialIcons[link.platform] || Globe
                      const url = link.platform === 'envelope' ? `mailto:${link.url}` : link.url
                      return (
                        <a
                          key={link.id || j}
                          href={url}
                          target={link.platform === 'envelope' ? undefined : '_blank'}
                          rel="noopener noreferrer"
                          aria-label={link.platform}
                          className="flex h-9 w-9 items-center justify-center rounded-full border text-slate-500 transition-all hover:-translate-y-0.5"
                          style={{ borderColor: 'var(--cms-muted-bg, #F1F5F9)' }}
                        >
                          <Icon className="h-4 w-4" />
                        </a>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
