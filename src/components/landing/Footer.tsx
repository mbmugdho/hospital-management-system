'use client'

import Link from 'next/link'
import Container from '@/components/shared/Container'
import AnimateIn from '@/components/shared/AnimateIn'
import {
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  Globe,
  MessageCircle,
  AtSign,
} from 'lucide-react'
import { APP_NAME } from '@/lib/constants'

const footerLinks = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Security', href: '#' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Press', href: '#' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Help Center', href: '#' },
      { label: 'Docs', href: '#' },
      { label: 'Status', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
]

const socialLinks = [
  { icon: AtSign, href: '#', label: 'Twitter' },
  { icon: Globe, href: '#', label: 'LinkedIn' },
  { icon: MessageCircle, href: '#', label: 'GitHub' },
  { icon: Mail, href: '#', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <Container>
        <AnimateIn>
          <div className="py-14 lg:py-16">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
              {/* Brand */}
              <div className="col-span-2 flex flex-col gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2.5 w-fit"
                >
                  <div
                    className="
                    w-8 h-8 rounded-lg
                    bg-gradient-to-br from-indigo-500 to-purple-500
                    flex items-center justify-center
                  "
                  >
                    <HeartPulse className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-bold text-white tracking-tight">
                    {APP_NAME}
                  </span>
                </Link>

                <p className="text-sm text-white/20 leading-relaxed max-w-[240px]">
                  Modern hospital management for healthcare professionals who
                  care about efficiency.
                </p>

                {/* Social */}
                <div className="flex items-center gap-2">
                  {socialLinks.map((social) => {
                    const Icon = social.icon
                    return (
                      <Link
                        key={social.label}
                        href={social.href}
                        aria-label={social.label}
                        className="
                          w-8 h-8 rounded-lg
                          bg-white/[0.03]
                          border border-white/[0.06]
                          flex items-center justify-center
                          text-white/20
                          hover:text-white
                          hover:bg-indigo-500/20
                          hover:border-indigo-500/20
                          transition-all duration-200
                        "
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Links */}
              {footerLinks.map((group) => (
                <div key={group.heading} className="flex flex-col gap-3">
                  <h4
                    className="
                    text-xs font-semibold text-white/40
                    uppercase tracking-widest
                  "
                  >
                    {group.heading}
                  </h4>
                  <ul className="flex flex-col gap-2">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="
                            text-sm text-white/20
                            hover:text-white/60
                            transition-colors duration-200
                          "
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>
      </Container>

      {/* Bottom */}
      <div className="border-t border-white/[0.04]">
        <Container>
          <div
            className="
            py-5
            flex flex-col sm:flex-row
            items-center justify-between gap-4
          "
          >
            <p className="text-xs text-white/15">
              © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {['Privacy', 'Terms', 'Cookies'].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-xs text-white/15 hover:text-white/40 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </footer>
  )
}
