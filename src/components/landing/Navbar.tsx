'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HeartPulse, ArrowRight, Menu, X, LayoutDashboard } from 'lucide-react'
import Container from '@/components/shared/Container'
import { APP_NAME } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<{
    email?: string
    full_name?: string
  } | null>(null)

  /* ── Check auth state ── */
  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (authUser) {
        setUser({
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || '',
        })
      }
    }
    checkUser()
  }, [])

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

  /* ── Get initials ── */
  const getInitials = () => {
    if (user?.full_name) {
      return user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return 'U'
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`
        sticky top-0 z-50 w-full
        backdrop-blur-xl border-b
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
            {user ? (
              /* ── Logged In State ── */
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    className="
                      inline-flex items-center gap-2
                      bg-white text-black
                      hover:bg-white/90
                      rounded-xl px-5 h-9
                      font-semibold text-sm
                      shadow-md shadow-white/10
                      transition-colors duration-200
                    "
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </motion.button>
                </Link>

                {/* Avatar */}
                <Link href="/dashboard">
                  <div
                    className="
                    w-9 h-9 rounded-full
                    bg-gradient-to-br from-indigo-500 to-purple-500
                    flex items-center justify-center
                    border-2 border-white/10
                    hover:border-white/20
                    transition-colors duration-200
                    cursor-pointer
                  "
                  >
                    <span className="text-white text-xs font-bold">
                      {getInitials()}
                    </span>
                  </div>
                </Link>
              </div>
            ) : (
              /* ── Logged Out State ── */
              <>
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
              </>
            )}
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
            ? { opacity: 1, y: 0, pointerEvents: 'auto' as const }
            : { opacity: 0, y: -8, pointerEvents: 'none' as const }
        }
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="
          md:hidden absolute top-16 left-0 right-0
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

          {user ? (
            /* ── Mobile Logged In ── */
            <>
              <div className="flex items-center gap-3 px-4 py-2 mb-2">
                <div
                  className="
                  w-8 h-8 rounded-full
                  bg-gradient-to-br from-indigo-500 to-purple-500
                  flex items-center justify-center
                "
                >
                  <span className="text-white text-[10px] font-bold">
                    {getInitials()}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium text-white/60">
                    {user.full_name || 'User'}
                  </p>
                  <p className="text-[10px] text-white/25">{user.email}</p>
                </div>
              </div>

              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="
                    w-full inline-flex items-center justify-center gap-2
                    bg-white text-black hover:bg-white/90
                    rounded-xl h-11 font-semibold text-sm
                  "
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Go to Dashboard
                </motion.button>
              </Link>
            </>
          ) : (
            /* ── Mobile Logged Out ── */
            <>
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
                    bg-white text-black hover:bg-white/90
                    rounded-xl h-11 font-semibold text-sm
                  "
                >
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </motion.button>
              </Link>
            </>
          )}
        </Container>
      </motion.div>
    </motion.header>
  )
}
