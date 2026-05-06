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
        backdrop-blur-xl
        border-b
        transition-all duration-300
        ${
          scrolled
            ? 'bg-black/70 border-white/[0.06] shadow-lg shadow-black/20'
            : 'bg-transparent border-transparent'
        }
      `}
    >
      <Container>
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="
              w-9 h-9 rounded-xl
              bg-gradient-to-br from-[#6366F1] to-[#4F46E5]
              flex items-center justify-center
              shadow-md shadow-indigo-500/20
              group-hover:shadow-lg group-hover:shadow-indigo-500/30
              transition-shadow duration-300
            "
            >
              <HeartPulse className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="
                  px-4 py-2 rounded-lg
                  text-sm font-medium text-white/50
                  hover:text-white hover:bg-white/[0.06]
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
                text-sm font-medium text-white/50
                hover:text-white hover:bg-white/[0.06]
                transition-all duration-200
              "
            >
              Sign in
            </Link>
            <Link href="/register">
              <button
                className="
                inline-flex items-center
                bg-white text-black
                hover:bg-white/90
                rounded-xl px-5 h-9
                font-semibold text-sm
                shadow-md shadow-white/10
                transition-all duration-300
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
              text-white/50 hover:text-white
              hover:bg-white/[0.06]
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
          bg-black/90 backdrop-blur-xl
          border-b border-white/[0.06]
          shadow-lg shadow-black/30
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
                text-sm font-medium text-white/50
                hover:text-white hover:bg-white/[0.06]
                transition-all duration-200
              "
            >
              {link.label}
            </Link>
          ))}

          <div className="my-2 border-t border-white/[0.06]" />

          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="
              px-4 py-3 rounded-xl
              text-sm font-medium text-white/50
              hover:text-white hover:bg-white/[0.06]
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
              bg-white text-black
              hover:bg-white/90
              rounded-xl h-11
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
