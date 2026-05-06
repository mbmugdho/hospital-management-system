'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  HeartPulse,
  LayoutDashboard,
  Users,
  CalendarDays,
  Stethoscope,
  Receipt,
  Pill,
  Settings,
  LogOut,
  X,
  ChevronRight,
} from 'lucide-react'
import { APP_NAME } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

interface SidebarProps {
  user: {
    email?: string
    full_name?: string
    hospital_name?: string
  } | null
  mobileOpen: boolean
  onMobileClose: () => void
}

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Patients', href: '/patients', icon: Users },
  { label: 'Appointments', href: '/appointments', icon: CalendarDays },
  { label: 'Doctors & Staff', href: '/doctors', icon: Stethoscope },
  { label: 'Billing', href: '/billing', icon: Receipt },
  { label: 'Pharmacy', href: '/pharmacy', icon: Pill },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar({
  user,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

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

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  /* ── Sidebar Content ── */
  const sidebarContent = (
    <div
      className="
      flex flex-col h-full
      bg-[#0A0A0A]
      border-r border-white/[0.06]
    "
    >
      {/* ── Logo ── */}
      <div
        className="
        flex items-center justify-between
        px-5 h-16
        border-b border-white/[0.06]
      "
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 group"
          onClick={onMobileClose}
        >
          <div
            className="
            w-8 h-8 rounded-lg
            bg-gradient-to-br from-indigo-500 to-purple-500
            flex items-center justify-center
            shadow-md shadow-indigo-500/20
            group-hover:shadow-lg group-hover:shadow-indigo-500/30
            transition-shadow duration-300
          "
          >
            <HeartPulse className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-white tracking-tight">
            {APP_NAME}
          </span>
        </Link>

        {/* Close button — mobile only */}
        <button
          onClick={onMobileClose}
          className="
            lg:hidden p-1.5 rounded-lg
            text-white/30 hover:text-white
            hover:bg-white/[0.06]
            transition-all duration-200
          "
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link key={item.href} href={item.href} onClick={onMobileClose}>
                <div
                  className={`
                  flex items-center gap-3
                  px-3 py-2.5
                  rounded-xl
                  text-sm font-medium
                  transition-all duration-200
                  group
                  ${
                    active
                      ? 'bg-indigo-500/10 text-white border border-indigo-500/20'
                      : 'text-white/35 hover:text-white/60 hover:bg-white/[0.04] border border-transparent'
                  }
                `}
                >
                  <Icon
                    className={`
                    w-[18px] h-[18px]
                    ${
                      active
                        ? 'text-indigo-400'
                        : 'text-white/25 group-hover:text-white/50'
                    }
                    transition-colors duration-200
                  `}
                  />

                  <span className="flex-1">{item.label}</span>

                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                    </motion.div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* ── User Section ── */}
      <div
        className="
        px-3 py-4
        border-t border-white/[0.06]
      "
      >
        {/* User Info */}
        <Link
          href="/settings"
          onClick={onMobileClose}
          className="
            flex items-center gap-3
            px-3 py-2.5 mb-1
            rounded-xl
            hover:bg-white/[0.04]
            transition-colors duration-200
            group
          "
        >
          <div
            className="
            w-8 h-8 rounded-full
            bg-gradient-to-br from-indigo-500 to-purple-500
            flex items-center justify-center
            flex-shrink-0
          "
          >
            <span className="text-white text-[10px] font-bold">
              {getInitials()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white/60 truncate">
              {user?.full_name || 'User'}
            </p>
            <p className="text-[11px] text-white/20 truncate">
              {user?.hospital_name || user?.email || ''}
            </p>
          </div>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="
            flex items-center gap-3
            w-full px-3 py-2.5
            rounded-xl
            text-sm font-medium
            text-red-400/50
            hover:text-red-400
            hover:bg-red-500/[0.06]
            transition-all duration-200
          "
        >
          <LogOut className="w-[18px] h-[18px]" />
          Sign out
        </button>

        {/* Back to Homepage */}
        <Link href="/" onClick={onMobileClose}>
          <div
            className="
            flex items-center gap-3
            px-3 py-2.5 mt-0.5
            rounded-xl
            text-sm font-medium
            text-white/20
            hover:text-white/40
            hover:bg-white/[0.04]
            transition-all duration-200
          "
          >
            <HeartPulse className="w-[18px] h-[18px]" />
            Visit Homepage
          </div>
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside
        className="
        hidden lg:flex
        w-[260px] flex-shrink-0
        h-screen sticky top-0
      "
      >
        {sidebarContent}
      </aside>

      {/* ── Mobile Overlay ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={onMobileClose}
        />
      )}

      {/* ── Mobile Drawer ── */}
      <motion.aside
        initial={false}
        animate={mobileOpen ? { x: 0, opacity: 1 } : { x: -280, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="
          lg:hidden
          fixed top-0 left-0 bottom-0
          w-[280px] z-50
        "
      >
        {sidebarContent}
      </motion.aside>
    </>
  )
}
