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
  Calendar,
  AlertTriangle,
  UserPlus,
  DollarSign,
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

interface Notification {
  id: string
  icon: typeof Bell
  color: string
  bg: string
  title: string
  desc: string
  time: string
  unread: boolean
}

const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    icon: Calendar,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    title: 'Appointment Reminder',
    desc: 'Dr. Sarah Mitchell has 3 appointments today',
    time: '5 min ago',
    unread: true,
  },
  {
    id: 'n2',
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    title: 'Low Stock Alert',
    desc: 'Amoxicillin is running low — 12 units remaining',
    time: '1 hour ago',
    unread: true,
  },
  {
    id: 'n3',
    icon: UserPlus,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    title: 'New Patient Registered',
    desc: 'James Okafor was added to the patient list',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 'n4',
    icon: DollarSign,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    title: 'Invoice Paid',
    desc: 'Invoice #INV-0042 was marked as paid — $1,240.00',
    time: '3 hours ago',
    unread: false,
  },
]

export default function DashboardNavbar({
  user,
  onMenuClick,
}: DashboardNavbarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS)
  const [loggingOut, setLoggingOut] = useState(false)

  const unreadCount = notifications.filter((n) => n.unread).length

  function getPageTitle() {
    for (const [path, title] of Object.entries(pageTitles)) {
      if (pathname.startsWith(path)) return title
    }
    return 'Dashboard'
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  function dismissNotification(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  // Close both dropdowns on outside click
  useEffect(() => {
    function handleClick() {
      setDropdownOpen(false)
      setNotifOpen(false)
    }
    if (dropdownOpen || notifOpen) {
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [dropdownOpen, notifOpen])

  async function handleLogout() {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  function getInitials() {
    if (user?.full_name) {
      return user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.email) return user.email.charAt(0).toUpperCase()
    return 'U'
  }

  return (
    <header
      className="sticky top-0 z-30 h-16 bg-[#050505]/80
      backdrop-blur-xl border-b border-white/[0.06]
      flex items-center px-4 lg:px-6 gap-4"
    >
      {/* Mobile menu */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl text-white/40 hover:text-white
          hover:bg-white/[0.06] transition-all duration-200"
      >
        <Menu className="w-5 h-5" />
      </motion.button>

      {/* Page title */}
      <div className="flex-1">
        <h1 className="text-base font-semibold text-white/80">
          {getPageTitle()}
        </h1>
      </div>

      {/* Search */}
      <div
        className="hidden md:flex items-center gap-2 w-64 h-9
        bg-white/[0.03] border border-white/[0.06] rounded-xl px-3
        text-white/20 hover:border-white/[0.1] focus-within:border-indigo-500/30
        focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all duration-200"
      >
        <Search className="w-3.5 h-3.5 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 bg-transparent text-sm text-white
            placeholder:text-white/20 focus:outline-none"
        />
      </div>

      {/* Notification bell */}
      <div className="relative">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation()
            setNotifOpen((v) => !v)
            setDropdownOpen(false)
          }}
          className="relative p-2 rounded-xl text-white/30 hover:text-white/60
            hover:bg-white/[0.06] transition-all duration-200"
        >
          <Bell className="w-[18px] h-[18px]" />
          {/* Unread badge */}
          {unreadCount > 0 && (
            <span
              className="absolute top-1 right-1 min-w-[16px] h-4
              bg-indigo-500 rounded-full text-white text-[10px] font-bold
              flex items-center justify-center px-1 border border-[#050505]"
            >
              {unreadCount}
            </span>
          )}
        </motion.button>

        {/* Notification dropdown */}
        <AnimatePresence>
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-12 w-80 bg-[#111111]
                border border-white/[0.08] rounded-xl shadow-2xl
                shadow-black/50 overflow-hidden z-50"
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-4 py-3
                border-b border-white/[0.06]"
              >
                <div className="flex items-center gap-2">
                  <p className="text-white/80 text-sm font-medium">
                    Notifications
                  </p>
                  {unreadCount > 0 && (
                    <span
                      className="px-1.5 py-0.5 bg-indigo-500/20
                      text-indigo-400 text-xs rounded-full font-medium"
                    >
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-white/30 hover:text-indigo-400
                      transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification list */}
              <div className="max-h-[340px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <Bell className="w-8 h-8 text-white/10 mx-auto mb-2" />
                    <p className="text-white/30 text-sm">No notifications</p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const Icon = notif.icon
                    return (
                      <motion.div
                        key={notif.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={`flex items-start gap-3 px-4 py-3
                          border-b border-white/[0.04] last:border-0
                          hover:bg-white/[0.03] transition-colors duration-150
                          ${notif.unread ? 'bg-white/[0.015]' : ''}`}
                      >
                        {/* Icon */}
                        <div
                          className={`p-2 rounded-xl flex-shrink-0 mt-0.5
                          ${notif.bg}`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${notif.color}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-sm font-medium leading-snug
                              ${notif.unread ? 'text-white/90' : 'text-white/50'}`}
                            >
                              {notif.title}
                            </p>
                            {/* Dismiss */}
                            <button
                              onClick={() => dismissNotification(notif.id)}
                              className="text-white/15 hover:text-white/40
                                transition-colors flex-shrink-0 text-lg leading-none"
                            >
                              &times;
                            </button>
                          </div>
                          <p className="text-white/30 text-xs mt-0.5 leading-relaxed">
                            {notif.desc}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-white/20 text-xs">
                              {notif.time}
                            </p>
                            {notif.unread && (
                              <span
                                className="w-1.5 h-1.5 rounded-full
                                bg-indigo-500 flex-shrink-0"
                              />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-white/[0.06]">
                <p className="text-white/20 text-xs text-center">
                  Sample notifications — real alerts coming soon
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User avatar + dropdown */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            setDropdownOpen(!dropdownOpen)
            setNotifOpen(false)
          }}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500
            to-purple-500 flex items-center justify-center
            border-2 border-white/[0.08] hover:border-white/[0.15]
            transition-colors duration-200 cursor-pointer"
        >
          <span className="text-white text-xs font-bold">{getInitials()}</span>
        </motion.button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-12 w-56 bg-[#111111]
                border border-white/[0.08] rounded-xl shadow-2xl
                shadow-black/50 overflow-hidden z-50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* User info */}
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <p className="text-sm font-medium text-white/70 truncate">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-xs text-white/25 truncate">{user?.email}</p>
              </div>

              {/* Links */}
              <div className="py-1.5">
                <Link
                  href="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                    text-white/40 hover:text-white hover:bg-white/[0.04]
                    transition-colors duration-150"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                    text-white/40 hover:text-white hover:bg-white/[0.04]
                    transition-colors duration-150"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <Link
                  href="/"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                    text-white/40 hover:text-white hover:bg-white/[0.04]
                    transition-colors duration-150"
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
                  className="flex items-center gap-2.5 w-full px-4 py-2.5
                    text-sm text-red-400/60 hover:text-red-400
                    hover:bg-red-500/[0.06] disabled:opacity-50
                    transition-colors duration-150"
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
