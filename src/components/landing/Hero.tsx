'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, HeartPulse, CheckCircle2 } from 'lucide-react'
import Container from '@/components/shared/Container'
import AnimateIn from '@/components/shared/AnimateIn'

/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */

const statCards = [
  {
    label: 'Total Patients',
    value: '1,240',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    label: 'Appointments',
    value: '48',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    label: 'Revenue',
    value: '$24.5k',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    label: 'New Today',
    value: '12',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
  },
]

const chartBars = [
  { height: '35%', active: false },
  { height: '55%', active: false },
  { height: '40%', active: false },
  { height: '70%', active: false },
  { height: '50%', active: false },
  { height: '85%', active: true },
  { height: '65%', active: false },
  { height: '45%', active: false },
  { height: '75%', active: false },
  { height: '60%', active: false },
  { height: '90%', active: false },
  { height: '50%', active: false },
]

const miniPatients = [
  {
    name: 'James Thornton',
    role: 'Cardiology',
    status: 'Active',
    statusColor: 'bg-emerald-500/20 text-emerald-400',
  },
  {
    name: 'Maria Gonzalez',
    role: 'Neurology',
    status: 'Admitted',
    statusColor: 'bg-blue-500/20 text-blue-400',
  },
  {
    name: 'David Park',
    role: 'Orthopedics',
    status: 'Active',
    statusColor: 'bg-emerald-500/20 text-emerald-400',
  },
  {
    name: 'Emily Carter',
    role: 'Pediatrics',
    status: 'Pending',
    statusColor: 'bg-amber-500/20 text-amber-400',
  },
  {
    name: 'Robert Williams',
    role: 'Emergency',
    status: 'Active',
    statusColor: 'bg-emerald-500/20 text-emerald-400',
  },
]

const sidebarItems = [
  { label: 'Dashboard', active: true },
  { label: 'Patients', active: false },
  { label: 'Appointments', active: false },
  { label: 'Doctors', active: false },
  { label: 'Billing', active: false },
  { label: 'Pharmacy', active: false },
  { label: 'Settings', active: false },
]

const avatars = [
  { initials: 'JT', color: 'from-blue-400 to-blue-500' },
  { initials: 'MG', color: 'from-emerald-400 to-emerald-500' },
  { initials: 'DP', color: 'from-violet-400 to-violet-500' },
  { initials: 'EC', color: 'from-orange-400 to-orange-500' },
]

/* ═══════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════ */

export default function Hero() {
  return (
    <section className="relative pt-16 lg:pt-24 pb-0 overflow-visible">
      <Container>
        {/* ══════════════════════════════
            TEXT CONTENT — CENTERED
        ══════════════════════════════ */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          {/* Badge — with shimmer */}
          <AnimateIn delay={0.1}>
            <span
              className="
              inline-flex items-center gap-2
              px-4 py-1.5 rounded-full
              bg-white/[0.06] border border-white/[0.08]
              text-white/60 text-xs font-semibold
              tracking-wide uppercase mb-6
              relative overflow-hidden
            "
            >
              {/* Shimmer overlay */}
              <span
                className="
                absolute inset-0
                animate-shimmer
                bg-gradient-to-r from-transparent via-white/[0.07] to-transparent
                pointer-events-none
              "
              />
              <HeartPulse className="w-3.5 h-3.5 text-indigo-400" />
              Hospital Management System
            </span>
          </AnimateIn>

          {/* Headline — gradient text animated */}
          <AnimateIn delay={0.2}>
            <h1
              className="
              text-4xl sm:text-5xl lg:text-6xl xl:text-7xl
              font-bold text-white
              leading-[1.05] tracking-tight mb-6
            "
            >
              The Modern Way to Manage Your{' '}
              <span
                className="
                animate-gradient-shift
                bg-gradient-to-r from-indigo-400 via-purple-400 via-pink-300 to-indigo-400
                bg-clip-text text-transparent
                inline-block
              "
              >
                Hospital
              </span>
            </h1>
          </AnimateIn>

          {/* Subtext */}
          <AnimateIn delay={0.3}>
            <p
              className="
              text-base lg:text-lg
              text-white/40 leading-relaxed
              max-w-2xl mb-8
            "
            >
              Streamline patients, appointments, billing, and pharmacy
              management — all in one powerful platform built for modern
              healthcare professionals.
            </p>
          </AnimateIn>

          {/* CTA Buttons */}
          <AnimateIn delay={0.4}>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="
                    inline-flex items-center
                    bg-white text-black
                    hover:bg-white/90
                    rounded-xl px-7 h-12
                    font-semibold text-sm
                    shadow-lg shadow-white/10
                    hover:shadow-xl hover:shadow-white/20
                  "
                >
                  Start for Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </motion.button>
              </Link>

              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="
                    inline-flex items-center
                    bg-white/[0.06] hover:bg-white/[0.1]
                    text-white
                    rounded-xl px-7 h-12
                    font-semibold text-sm
                    border border-white/[0.08]
                    hover:border-white/[0.15]
                  "
                >
                  View Demo
                </motion.button>
              </Link>
            </div>
          </AnimateIn>

          {/* Trust */}
          <AnimateIn delay={0.5}>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Avatars */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {avatars.map((avatar, i) => (
                    <motion.div
                      key={avatar.initials}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.08, duration: 0.3 }}
                      className={`
                        w-7 h-7 rounded-full
                        bg-gradient-to-br ${avatar.color}
                        border-2 border-black
                        flex items-center justify-center
                      `}
                    >
                      <span className="text-white text-[8px] font-bold">
                        {avatar.initials}
                      </span>
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm text-white/40">
                  Trusted by{' '}
                  <span className="font-semibold text-white/70">500+</span>{' '}
                  hospitals
                </p>
              </div>

              <div className="hidden sm:block w-px h-4 bg-white/[0.1]" />

              {/* Stars */}
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.svg
                      key={star}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.7 + star * 0.06,
                        type: 'spring',
                        stiffness: 400,
                        damping: 15,
                      }}
                      className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                  ))}
                </div>
                <span className="text-sm text-white/40">
                  <span className="font-semibold text-white/70">4.9</span>{' '}
                  rating
                </span>
              </div>
            </div>
          </AnimateIn>
        </div>

        {/* ══════════════════════════════
            DASHBOARD MOCKUP — BELOW
        ══════════════════════════════ */}
        <AnimateIn delay={0.6} duration={0.9} blur={false}>
          <div className="relative max-w-[1200px] mx-auto">
            {/* Glow — animated pulse */}
            <div
              className="
              absolute -inset-4 lg:-inset-8
              bg-gradient-to-b from-indigo-500/25 via-purple-500/10 to-transparent
              rounded-3xl blur-3xl
              animate-glow-pulse
              pointer-events-none
            "
            />

            {/* Dashboard frame — floats */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="
                relative
                rounded-xl lg:rounded-2xl
                border border-white/[0.08]
                bg-[#0A0A0A]
                shadow-2xl shadow-black/50
                overflow-hidden
              "
            >
              {/* Browser Chrome */}
              <div
                className="
                bg-[#111111]
                border-b border-white/[0.06]
                px-4 py-3
                flex items-center gap-3
              "
              >
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <div
                  className="
                  flex-1 mx-8 h-7
                  bg-white/[0.04] border border-white/[0.06]
                  rounded-lg flex items-center px-3 gap-2
                "
                >
                  <div className="w-3 h-3 rounded-full bg-white/[0.1]" />
                  <span className="text-[11px] text-white/20 font-medium">
                    app.medicore.com/dashboard
                  </span>
                </div>
              </div>

              {/* App Layout */}
              <div className="flex min-h-[500px] lg:min-h-[580px]">
                {/* Sidebar */}
                <div
                  className="
                  hidden sm:flex
                  w-[200px] lg:w-[220px]
                  bg-[#0A0A0A]
                  border-r border-white/[0.06]
                  p-4 flex-col gap-1
                "
                >
                  <div className="flex items-center gap-2.5 px-3 py-2.5 mb-4">
                    <div
                      className="
                      w-7 h-7 rounded-lg
                      bg-gradient-to-br from-indigo-500 to-purple-500
                      flex items-center justify-center
                    "
                    >
                      <HeartPulse className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-bold text-white/80">
                      MediCore
                    </span>
                  </div>

                  {sidebarItems.map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.8 + i * 0.06,
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={`
                        flex items-center gap-2.5
                        px-3 py-2 rounded-lg text-sm
                        ${
                          item.active
                            ? 'bg-white/[0.06] text-white font-medium'
                            : 'text-white/30'
                        }
                      `}
                    >
                      <div
                        className={`
                        w-1.5 h-1.5 rounded-full
                        ${item.active ? 'bg-indigo-400 animate-pulse' : 'bg-white/20'}
                      `}
                      />
                      {item.label}
                    </motion.div>
                  ))}
                </div>

                {/* Main Content */}
                <div
                  className="
                  flex-1 bg-[#050505]
                  p-5 lg:p-6
                  flex flex-col gap-5
                "
                >
                  {/* Top bar */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white/80">
                        Dashboard
                      </h3>
                      <p className="text-xs text-white/25 mt-0.5">
                        Welcome back, Dr. Mitchell
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="
                        h-7 px-3
                        bg-white/[0.04] border border-white/[0.06]
                        rounded-lg flex items-center
                        text-[11px] text-white/20
                      "
                      >
                        Last 7 days
                      </div>
                      <div
                        className="
                        h-7 px-3
                        bg-indigo-500/20 border border-indigo-500/20
                        rounded-lg flex items-center
                        text-[11px] text-indigo-300 font-medium
                      "
                      >
                        + New Patient
                      </div>
                    </div>
                  </div>

                  {/* Stat Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {statCards.map((card, i) => (
                      <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.9 + i * 0.08,
                          duration: 0.4,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="
                          bg-white/[0.02] border border-white/[0.06]
                          rounded-xl p-4
                        "
                      >
                        <p className="text-xs text-white/25 mb-2">
                          {card.label}
                        </p>
                        <p className={`text-xl font-bold ${card.color}`}>
                          {card.value}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Charts + Patients */}
                  <div className="grid lg:grid-cols-5 gap-4 flex-1">
                    {/* Chart */}
                    <div
                      className="
                      lg:col-span-3
                      bg-white/[0.02] border border-white/[0.06]
                      rounded-xl p-4
                    "
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-medium text-white/40">
                          Revenue Overview
                        </span>
                        <span className="text-xs text-white/20">This Week</span>
                      </div>
                      <div className="flex items-end gap-1.5 h-32">
                        {chartBars.map((bar, i) => (
                          <motion.div
                            key={i}
                            initial={{ scaleY: 0, originY: 1 }}
                            animate={{ scaleY: 1 }}
                            transition={{
                              delay: 1.0 + i * 0.04,
                              duration: 0.5,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            style={{
                              height: bar.height,
                              backgroundColor: bar.active
                                ? '#6366F1'
                                : 'rgba(255,255,255,0.04)',
                              transformOrigin: 'bottom',
                            }}
                            className="flex-1 rounded-t-sm"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Recent Patients */}
                    <div
                      className="
                      lg:col-span-2
                      bg-white/[0.02] border border-white/[0.06]
                      rounded-xl p-4
                    "
                    >
                      <span className="text-xs font-medium text-white/40 block mb-3">
                        Recent Patients
                      </span>
                      <div className="flex flex-col gap-2.5">
                        {miniPatients.map((patient, i) => (
                          <motion.div
                            key={patient.name}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: 1.1 + i * 0.07,
                              duration: 0.35,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="flex items-center gap-3"
                          >
                            <div
                              className="
                              w-7 h-7 rounded-full
                              bg-gradient-to-br from-white/10 to-white/5
                              border border-white/[0.08]
                              flex items-center justify-center flex-shrink-0
                            "
                            >
                              <span className="text-white/60 text-[9px] font-bold">
                                {patient.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-white/60 truncate">
                                {patient.name}
                              </p>
                              <p className="text-[10px] text-white/20">
                                {patient.role}
                              </p>
                            </div>
                            <span
                              className={`
                              text-[10px] font-medium px-2 py-0.5
                              rounded-full ${patient.statusColor}
                            `}
                            >
                              {patient.status}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bottom fade */}
            <div
              className="
              absolute bottom-0 left-0 right-0
              h-48
              bg-gradient-to-t from-black via-black/90 to-transparent
              pointer-events-none
              rounded-b-2xl
            "
            />
          </div>
        </AnimateIn>
      </Container>
    </section>
  )
}
