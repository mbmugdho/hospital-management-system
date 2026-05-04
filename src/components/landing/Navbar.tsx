'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { HeartPulse, ArrowRight, Menu, X } from 'lucide-react'
import Container from '@/components/shared/Container'
import { APP_NAME } from '@/lib/constants'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header
      className={`
        sticky top-0 z-50 w-full
        bg-white/80 backdrop-blur-lg
        border-b
        transition-all duration-300
        ${scrolled ? 'border-[#E2E8F0] shadow-sm' : 'border-transparent'}
      `}
    >
      <Container>
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="
                w-9 h-9 rounded-xl
                bg-gradient-to-br from-[#3B82F6] to-[#2563EB]
                flex items-center justify-center
                shadow-md shadow-blue-200
                group-hover:shadow-lg group-hover:shadow-blue-200
                transition-shadow duration-300
              "
            >
              <HeartPulse className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="text-xl font-bold text-[#0F172A] tracking-tight">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="
                  px-4 py-2 rounded-lg
                  text-sm font-medium text-[#64748B]
                  hover:text-[#0F172A] hover:bg-[#F1F5F9]
                  transition-all duration-200
                "
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="
                px-4 py-2 rounded-lg
                text-sm font-medium text-[#64748B]
                hover:text-[#0F172A] hover:bg-[#F1F5F9]
                transition-all duration-200
              "
            >
              Sign in
            </Link>
            <Link href="/register">
              <button
                className="
                  inline-flex items-center
                  bg-gradient-to-r from-[#3B82F6] to-[#2563EB]
                  hover:from-[#2563EB] hover:to-[#1D4ED8]
                  text-white rounded-xl px-5 h-9
                  shadow-md shadow-blue-200
                  hover:shadow-lg hover:shadow-blue-200
                  transition-all duration-300
                  font-semibold text-sm
                "
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="
              md:hidden p-2 rounded-xl
              text-[#64748B] hover:text-[#0F172A]
              hover:bg-[#F1F5F9]
              transition-all duration-200
            "
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      <div
        className={`
          md:hidden
          absolute top-16 left-0 right-0
          bg-white border-b border-[#E2E8F0]
          shadow-lg
          transition-all duration-300 ease-in-out
          ${
            mobileOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }
        `}
      >
        <Container className="py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="
                px-4 py-3 rounded-xl
                text-sm font-medium text-[#64748B]
                hover:text-[#0F172A] hover:bg-[#F1F5F9]
                transition-all duration-200
              "
            >
              {link.label}
            </Link>
          ))}

          <div className="my-2 border-t border-[#F1F5F9]" />

          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="
              px-4 py-3 rounded-xl
              text-sm font-medium text-[#64748B]
              hover:text-[#0F172A] hover:bg-[#F1F5F9]
              transition-all duration-200
            "
          >
            Sign in
          </Link>

          <Link href="/register" onClick={() => setMobileOpen(false)}>
            <button
              className="
                w-full mt-1
                inline-flex items-center justify-center
                bg-gradient-to-r from-[#3B82F6] to-[#2563EB]
                hover:from-[#2563EB] hover:to-[#1D4ED8]
                text-white rounded-xl h-11
                shadow-md shadow-blue-200
                font-semibold text-sm
              "
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          </Link>
        </Container>
      </div>
    </header>
  )
}
