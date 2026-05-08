'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  Search,
  Bell,
  Settings,
  LogOut,
  LayoutDashboard,
  User,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface DashboardNavbarProps {
  user: {
    email?: string
    full_name?: string
  } | null
  onMenuClick: () => void
}

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/patients': 'Patients',
  '/appointments': 'Appointments',
  '/doctors': 'Doctors & Staff',
  '/billing': 'Billing & Invoices',
  '/pharmacy': 'Pharmacy & Inventory',
  '/settings': 'Settings',
}

export default function DashboardNavbar({
  user,
  onMenuClick,
}: DashboardNavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  /* ── Page Title ── */
  const getPageTitle = () => {
    for (const [path, title] of Object.entries(pageTitles)) {
      if (pathname.startsWith(path)) return title
    }
    return 'Dashboard'
  }

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    const handleClick = () => setDropdownOpen(false)
    if (dropdownOpen) {
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [dropdownOpen])

  /* ── Logout ── */
  const handleLogout = async () => {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  /* ── Initials ── */
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
    <header
      className="
      sticky top-0 z-30
      h-16
      bg-[#050505]/80
      backdrop-blur-xl
      border-b border-white/[0.06]
      flex items-center
      px-4 lg:px-6
      gap-4
    "
    >
      {/* ── Mobile Menu Button ── */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onMenuClick}
        className="
          lg:hidden p-2 rounded-xl
          text-white/40 hover:text-white
          hover:bg-white/[0.06]
          transition-all duration-200
        "
      >
        <Menu className="w-5 h-5" />
      </motion.button>

      {/* ── Page Title ── */}
      <div className="flex-1">
        <h1 className="text-base font-semibold text-white/80">
          {getPageTitle()}
        </h1>
      </div>

      {/* ── Search Bar ── */}
      <div
        className="
        hidden md:flex
        items-center gap-2
        w-64 h-9
        bg-white/[0.03]
        border border-white/[0.06]
        rounded-xl
        px-3
        text-white/20
        hover:border-white/[0.1]
        focus-within:border-indigo-500/30
        focus-within:ring-1 focus-within:ring-indigo-500/20
        transition-all duration-200
      "
      >
        <Search className="w-3.5 h-3.5 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search..."
          className="
            flex-1 bg-transparent
            text-sm text-white
            placeholder:text-white/20
            focus:outline-none
          "
        />
      </div>

      {/* ── Notification Bell ── */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="
          relative p-2 rounded-xl
          text-white/30 hover:text-white/60
          hover:bg-white/[0.06]
          transition-all duration-200
        "
      >
        <Bell className="w-[18px] h-[18px]" />
        {/* Notification dot */}
        <span
          className="
          absolute top-1.5 right-1.5
          w-2 h-2 rounded-full
          bg-indigo-500
          border border-[#050505]
        "
        />
      </motion.button>

      {/* ── User Avatar + Dropdown ── */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            setDropdownOpen(!dropdownOpen)
          }}
          className="
            w-9 h-9 rounded-full
            bg-gradient-to-br from-indigo-500 to-purple-500
            flex items-center justify-center
            border-2 border-white/[0.08]
            hover:border-white/[0.15]
            transition-colors duration-200
            cursor-pointer
          "
        >
          <span className="text-white text-xs font-bold">{getInitials()}</span>
        </motion.button>

        {/* Dropdown */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="
                absolute right-0 top-12
                w-56
                bg-[#111111]
                border border-white/[0.08]
                rounded-xl
                shadow-2xl shadow-black/50
                overflow-hidden z-50
              "
              onClick={(e) => e.stopPropagation()}
            >
              {/* User Info */}
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <p className="text-sm font-medium text-white/70 truncate">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-xs text-white/25 truncate">{user?.email}</p>
              </div>

              {/* Menu */}
              <div className="py-1.5">
                <Link
                  href="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="
                    flex items-center gap-2.5
                    px-4 py-2.5
                    text-sm text-white/40
                    hover:text-white hover:bg-white/[0.04]
                    transition-colors duration-150
                  "
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="
                    flex items-center gap-2.5
                    px-4 py-2.5
                    text-sm text-white/40
                    hover:text-white hover:bg-white/[0.04]
                    transition-colors duration-150
                  "
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>

                <Link
                  href="/"
                  onClick={() => setDropdownOpen(false)}
                  className="
                    flex items-center gap-2.5
                    px-4 py-2.5
                    text-sm text-white/40
                    hover:text-white hover:bg-white/[0.04]
                    transition-colors duration-150
                  "
                >
                  <User className="w-4 h-4" />
                  Visit Homepage
                </Link>
              </div>

              {/* Logout */}
              <div className="border-t border-white/[0.06] py-1.5">
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="
                    flex items-center gap-2.5
                    w-full px-4 py-2.5
                    text-sm text-red-400/60
                    hover:text-red-400
                    hover:bg-red-500/[0.06]
                    disabled:opacity-50
                    transition-colors duration-150
                  "
                >
                  <LogOut className="w-4 h-4" />
                  {loggingOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
