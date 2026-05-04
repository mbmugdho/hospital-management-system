'use client'

import Link from 'next/link'
import Container from '@/components/shared/Container'
import AnimateIn from '@/components/shared/AnimateIn'
import {
  HeartPulse,
  Twitter,
  Linkedin,
  Github,
  Mail,
  MapPin,
  Phone,
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
      { label: 'Roadmap', href: '#' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Partners', href: '#' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Help Center', href: '#' },
      { label: 'Documentation', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Status', href: '#' },
      { label: 'Contact Us', href: '#' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'HIPAA Compliance', href: '#' },
      { label: 'Data Processing', href: '#' },
    ],
  },
]

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Mail, href: '#', label: 'Email' },
]

const contactInfo = [
  { icon: MapPin, text: '123 Medical Drive, Boston, MA 02101' },
  { icon: Phone, text: '+1 (555) 100-0000' },
  { icon: Mail, text: 'hello@medicore.com' },
]

export default function Footer() {
  return (
    <footer className="bg-[#0F172A]">
      <Container>
        <AnimateIn>
          <div className="py-16 lg:py-20">
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
              {/* Brand Column */}
              <div className="col-span-2 flex flex-col gap-5">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2.5 group w-fit"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center shadow-md shadow-blue-900 group-hover:shadow-lg transition-shadow duration-300">
                    <HeartPulse className="w-[18px] h-[18px] text-white" />
                  </div>
                  <span className="text-xl font-bold text-white tracking-tight">
                    {APP_NAME}
                  </span>
                </Link>
                <p className="text-sm text-[#64748B] leading-relaxed max-w-[220px]">
                  Modern hospital management system built for healthcare
                  professionals who care about efficiency and outcomes.
                </p>
                <div className="flex flex-col gap-2.5">
                  {contactInfo.map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.text} className="flex items-start gap-2.5">
                        <Icon className="w-3.5 h-3.5 text-[#475569] mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-[#475569] leading-relaxed">
                          {item.text}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <div className="flex items-center gap-2">
                  {socialLinks.map((social) => {
                    const Icon = social.icon
                    return (
                      <Link
                        key={social.label}
                        href={social.href}
                        aria-label={social.label}
                        className="w-8 h-8 rounded-lg bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[#64748B] hover:text-white hover:bg-[#3B82F6] hover:border-[#3B82F6] transition-all duration-200"
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </Link>
                    )
                  })}
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1E293B] border border-[#334155] w-fit">
                  <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-xs text-[#10B981] font-medium">
                    All systems operational
                  </span>
                </div>
              </div>

              {/* Link Columns */}
              {footerLinks.map((group) => (
                <div key={group.heading} className="flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest">
                    {group.heading}
                  </h4>
                  <ul className="flex flex-col gap-2.5">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-[#64748B] hover:text-white transition-colors duration-200 relative group/link inline-flex items-center gap-1"
                        >
                          <span className="absolute -left-3 opacity-0 group-hover/link:opacity-100 text-[#3B82F6] transition-opacity duration-200 text-xs">
                            ›
                          </span>
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

      <div className="border-t border-[#1E293B]" />

      <Container>
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#475569]">
            © {new Date().getFullYear()} {APP_NAME}, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-5 flex-wrap justify-center">
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map(
              (item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-xs text-[#475569] hover:text-white transition-colors duration-200"
                >
                  {item}
                </Link>
              )
            )}
          </div>
          <p className="text-xs text-[#475569] flex items-center gap-1">
            Made with
            <HeartPulse className="w-3 h-3 text-[#EF4444]" />
            for healthcare
          </p>
        </div>
      </Container>
    </footer>
  )
}
