'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`
        sticky top-0 z-50 w-full
        backdrop-blur-xl
        border-b
        transition-all duration-500
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
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                w-9 h-9 rounded-xl
                bg-gradient-to-br from-[#6366F1] to-[#4F46E5]
                flex items-center justify-center
                shadow-md shadow-indigo-500/20
                group-hover:shadow-lg group-hover:shadow-indigo-500/40
                transition-shadow duration-300
              "
            >
              <HeartPulse className="w-[18px] h-[18px] text-white" />
            </motion.div>
            <span className="text-xl font-bold text-white tracking-tight">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1 + i * 0.05,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
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
              </motion.div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:flex items-center gap-3"
          >
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
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="
                  inline-flex items-center
                  bg-white text-black
                  hover:bg-white/90
                  rounded-xl px-5 h-9
                  font-semibold text-sm
                  shadow-md shadow-white/10
                  transition-colors duration-200
                "
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Mobile Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="
              md:hidden p-2 rounded-xl
              text-white/50 hover:text-white
              hover:bg-white/[0.06]
              transition-all duration-200
            "
            aria-label="Toggle menu"
          >
            <motion.div
              animate={{ rotate: mobileOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </Container>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={
          mobileOpen
            ? { opacity: 1, y: 0, pointerEvents: 'auto' }
            : { opacity: 0, y: -8, pointerEvents: 'none' }
        }
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="
          md:hidden
          absolute top-16 left-0 right-0
          bg-black/90 backdrop-blur-xl
          border-b border-white/[0.06]
          shadow-lg shadow-black/30
        "
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
            <motion.button
              whileTap={{ scale: 0.97 }}
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
            </motion.button>
          </Link>
        </Container>
      </motion.div>
    </motion.header>
  )
}
