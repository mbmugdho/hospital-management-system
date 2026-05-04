import Link from 'next/link'
import {
  ArrowRight,
  HeartPulse,
  Users,
  CalendarDays,
  Receipt,
  CheckCircle2,
} from 'lucide-react'
import Container from '@/components/shared/Container'

/* ═══════════════════════════════════════════
   DASHBOARD MOCKUP DATA
═══════════════════════════════════════════ */

const statCards = [
  {
    label: 'Total Patients',
    value: '1,240',
    color: 'text-[#3B82F6]',
    bg: 'bg-blue-50',
  },
  {
    label: 'Appointments',
    value: '48',
    color: 'text-[#10B981]',
    bg: 'bg-emerald-50',
  },
  {
    label: 'Revenue',
    value: '$24k',
    color: 'text-[#8B5CF6]',
    bg: 'bg-violet-50',
  },
]

const chartBars = [
  { height: '40%', active: false },
  { height: '65%', active: false },
  { height: '45%', active: false },
  { height: '80%', active: false },
  { height: '55%', active: false },
  { height: '90%', active: true },
  { height: '70%', active: false },
]

const miniPatients = [
  { name: 'James Thornton', status: 'Active', color: 'bg-blue-400' },
  { name: 'Maria Gonzalez', status: 'Admitted', color: 'bg-emerald-400' },
  { name: 'David Park', status: 'Active', color: 'bg-violet-400' },
]

const sidebarItems = [
  { label: 'Dashboard', active: true },
  { label: 'Patients', active: false },
  { label: 'Appointments', active: false },
  { label: 'Billing', active: false },
  { label: 'Pharmacy', active: false },
]

/* ═══════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════ */

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* ── Background Decorations ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top right blob */}
        <div
          className="
          absolute -top-40 -right-40
          w-[700px] h-[700px] rounded-full
          bg-gradient-to-br from-blue-50 to-indigo-50
          opacity-70 blur-3xl
        "
        />
        {/* Bottom left blob */}
        <div
          className="
          absolute -bottom-40 -left-40
          w-[500px] h-[500px] rounded-full
          bg-gradient-to-tr from-emerald-50 to-cyan-50
          opacity-60 blur-3xl
        "
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle, #0F172A 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <Container className="relative">
        <div
          className="
          grid lg:grid-cols-2
          gap-12 lg:gap-8
          items-center
          pt-16 pb-20
          lg:pt-24 lg:pb-28
        "
        >
          {/* ══════════════════════════════
              LEFT — TEXT CONTENT
          ══════════════════════════════ */}
          <div className="flex flex-col gap-7">
            {/* Pill Badge */}
            <div className="inline-flex">
              <span
                className="
                inline-flex items-center gap-2
                px-4 py-1.5
                rounded-full
                bg-blue-50 border border-blue-100
                text-blue-700 text-xs font-semibold
                tracking-wide uppercase
              "
              >
                <HeartPulse className="w-3.5 h-3.5" />
                Hospital Management System
              </span>
            </div>

            {/* Headline */}
            <div className="flex flex-col gap-3">
              <h1
                className="
                text-4xl lg:text-5xl xl:text-[56px]
                font-bold
                text-[#0F172A]
                leading-[1.08]
                tracking-tight
              "
              >
                The Modern Way
                <br />
                to Manage Your{' '}
                <span
                  className="
                  relative inline-block
                  text-[#3B82F6]
                "
                >
                  Hospital
                  {/* Underline decoration */}
                  <svg
                    className="
                      absolute -bottom-2 left-0
                      w-full
                    "
                    viewBox="0 0 200 8"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 6 Q50 0 100 4 Q150 8 200 2"
                      stroke="#93C5FD"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </span>
              </h1>
            </div>

            {/* Subtext */}
            <p
              className="
              text-lg text-[#64748B]
              leading-relaxed
              max-w-[480px]
            "
            >
              Streamline patients, appointments, billing, and pharmacy
              management — all in one powerful platform built for modern
              healthcare professionals.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href="/register">
                <button
                  className="
                  inline-flex items-center
                  bg-gradient-to-r from-[#3B82F6] to-[#2563EB]
                  hover:from-[#2563EB] hover:to-[#1D4ED8]
                  text-white
                  rounded-xl px-7 h-12
                  font-semibold text-sm
                  shadow-lg shadow-blue-200
                  hover:shadow-xl hover:shadow-blue-200
                  hover:-translate-y-0.5
                  transition-all duration-300
                "
                >
                  Start for Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </Link>

              <Link href="/login">
                <button
                  className="
                  inline-flex items-center
                  bg-white
                  hover:bg-[#F8FAFC]
                  text-[#0F172A]
                  rounded-xl px-7 h-12
                  font-semibold text-sm
                  border border-[#E2E8F0]
                  hover:border-[#CBD5E1]
                  shadow-sm
                  hover:-translate-y-0.5
                  transition-all duration-300
                "
                >
                  View Demo
                </button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
              {/* Avatar stack */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {[
                    { initials: 'JT', color: 'from-blue-400 to-blue-500' },
                    {
                      initials: 'MG',
                      color: 'from-emerald-400 to-emerald-500',
                    },
                    { initials: 'DP', color: 'from-violet-400 to-violet-500' },
                    { initials: 'EC', color: 'from-orange-400 to-orange-500' },
                  ].map((avatar) => (
                    <div
                      key={avatar.initials}
                      className={`
                        w-8 h-8 rounded-full
                        bg-gradient-to-br ${avatar.color}
                        border-2 border-white
                        flex items-center justify-center
                        shadow-sm
                      `}
                    >
                      <span className="text-white text-[9px] font-bold">
                        {avatar.initials}
                      </span>
                    </div>
                  ))}
                  <div
                    className="
                    w-8 h-8 rounded-full
                    bg-[#F1F5F9]
                    border-2 border-white
                    flex items-center justify-center
                    shadow-sm
                  "
                  >
                    <span className="text-[#64748B] text-[9px] font-bold">
                      +496
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">
                    500+ Hospitals
                  </p>
                  <p className="text-xs text-[#64748B]">trust MediCore</p>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-8 bg-[#E2E8F0]" />

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-[#64748B]">
                  <span className="font-semibold text-[#0F172A]">4.9</span>{' '}
                  rating
                </p>
              </div>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { icon: Users, text: 'Patient Management' },
                { icon: CalendarDays, text: 'Appointments' },
                { icon: Receipt, text: 'Billing' },
                { icon: CheckCircle2, text: 'HIPAA Compliant' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <span
                    key={item.text}
                    className="
                      inline-flex items-center gap-1.5
                      px-3 py-1.5
                      rounded-lg
                      bg-[#F8FAFC]
                      border border-[#E2E8F0]
                      text-xs font-medium text-[#64748B]
                    "
                  >
                    <Icon className="w-3.5 h-3.5 text-[#3B82F6]" />
                    {item.text}
                  </span>
                )
              })}
            </div>
          </div>

          {/* ══════════════════════════════
              RIGHT — DASHBOARD MOCKUP
          ══════════════════════════════ */}
          <div className="relative hidden lg:flex justify-center items-center">
            {/* Glow behind mockup */}
            <div
              className="
              absolute inset-0
              bg-gradient-to-br from-blue-100 to-indigo-100
              rounded-3xl blur-3xl opacity-40
            "
            />

            {/* Main mockup card */}
            <div
              className="
              relative w-full max-w-[520px]
              rounded-2xl
              border border-[#E2E8F0]
              bg-white
              shadow-2xl shadow-slate-200
              overflow-hidden
            "
            >
              {/* Browser bar */}
              <div
                className="
                bg-[#1E293B]
                px-4 py-3
                flex items-center gap-3
              "
              >
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                  <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                </div>
                <div
                  className="
                  flex-1 mx-2
                  h-6
                  bg-[#334155]
                  rounded-md
                  flex items-center px-3
                "
                >
                  <div className="w-3 h-3 rounded-full bg-[#475569] mr-2" />
                  <div className="h-2 w-32 bg-[#475569] rounded" />
                </div>
              </div>

              {/* App body */}
              <div className="flex h-[380px]">
                {/* Sidebar */}
                <div
                  className="
                  w-[140px]
                  bg-[#1E293B]
                  p-3
                  flex flex-col gap-0.5
                "
                >
                  {/* Logo */}
                  <div
                    className="
                    flex items-center gap-2
                    px-2 py-2 mb-3
                  "
                  >
                    <div
                      className="
                      w-6 h-6 rounded-lg
                      bg-[#3B82F6]
                      flex items-center justify-center
                    "
                    >
                      <HeartPulse className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="h-2.5 w-14 bg-[#334155] rounded" />
                  </div>

                  {/* Nav items */}
                  {sidebarItems.map((item) => (
                    <div
                      key={item.label}
                      className={`
                        flex items-center gap-2
                        px-2 py-2 rounded-lg
                        ${
                          item.active ? 'bg-[#3B82F6]/20' : 'hover:bg-[#334155]'
                        }
                      `}
                    >
                      <div
                        className={`
                        w-3 h-3 rounded
                        ${item.active ? 'bg-[#3B82F6]' : 'bg-[#475569]'}
                      `}
                      />
                      <div
                        className={`
                        h-2 w-12 rounded
                        ${item.active ? 'bg-[#93C5FD]' : 'bg-[#475569]'}
                      `}
                      />
                    </div>
                  ))}
                </div>

                {/* Main content */}
                <div
                  className="
                  flex-1
                  bg-[#F8FAFC]
                  p-4
                  flex flex-col gap-3
                  overflow-hidden
                "
                >
                  {/* Page title */}
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-24 bg-[#CBD5E1] rounded" />
                    <div className="h-6 w-20 bg-[#3B82F6] rounded-lg opacity-80" />
                  </div>

                  {/* Stat cards */}
                  <div className="grid grid-cols-3 gap-2">
                    {statCards.map((card) => (
                      <div
                        key={card.label}
                        className="
                          bg-white rounded-xl p-3
                          border border-[#E2E8F0]
                          shadow-sm
                        "
                      >
                        <div
                          className={`
                          w-6 h-6 rounded-lg ${card.bg}
                          flex items-center justify-center mb-2
                        `}
                        >
                          <div className="w-3 h-3 rounded bg-current opacity-40" />
                        </div>
                        <p className={`text-sm font-bold ${card.color}`}>
                          {card.value}
                        </p>
                        <p className="text-[9px] text-[#94A3B8] mt-0.5">
                          {card.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Chart */}
                  <div
                    className="
                    bg-white rounded-xl
                    border border-[#E2E8F0]
                    p-3 shadow-sm
                  "
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-2.5 w-20 bg-[#E2E8F0] rounded" />
                      <div className="h-2 w-12 bg-[#F1F5F9] rounded" />
                    </div>
                    <div className="flex items-end gap-1.5 h-16">
                      {chartBars.map((bar, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t-md transition-all"
                          style={{
                            height: bar.height,
                            backgroundColor: bar.active ? '#3B82F6' : '#E2E8F0',
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Mini patient list */}
                  <div
                    className="
                    bg-white rounded-xl
                    border border-[#E2E8F0]
                    p-3 shadow-sm
                    flex-1
                  "
                  >
                    <div className="h-2.5 w-24 bg-[#E2E8F0] rounded mb-3" />
                    <div className="flex flex-col gap-2">
                      {miniPatients.map((patient) => (
                        <div
                          key={patient.name}
                          className="flex items-center gap-2"
                        >
                          <div
                            className={`
                            w-5 h-5 rounded-full
                            ${patient.color}
                            flex items-center justify-center
                            flex-shrink-0
                          `}
                          >
                            <span className="text-white text-[7px] font-bold">
                              {patient.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 h-2 bg-[#F1F5F9] rounded" />
                          <div
                            className="
                            h-4 w-10 rounded-full
                            bg-emerald-50
                            border border-emerald-100
                          "
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating card 1 — top right */}
            <div
              className="
              absolute -top-4 -right-4
              bg-white
              rounded-2xl
              shadow-xl shadow-slate-200
              border border-[#E2E8F0]
              px-4 py-3
              flex items-center gap-3
            "
            >
              <div
                className="
                w-9 h-9 rounded-xl
                bg-emerald-50
                flex items-center justify-center
                flex-shrink-0
              "
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-[11px] text-[#64748B]">Appointment</p>
                <p className="text-sm font-bold text-[#0F172A]">Confirmed ✓</p>
              </div>
            </div>

            {/* Floating card 2 — bottom left */}
            <div
              className="
              absolute -bottom-4 -left-4
              bg-white
              rounded-2xl
              shadow-xl shadow-slate-200
              border border-[#E2E8F0]
              px-4 py-3
              flex items-center gap-3
            "
            >
              <div
                className="
                w-9 h-9 rounded-xl
                bg-blue-50
                flex items-center justify-center
                flex-shrink-0
              "
              >
                <Users className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <div>
                <p className="text-[11px] text-[#64748B]">New Patient</p>
                <p className="text-sm font-bold text-[#0F172A]">
                  Just Registered
                </p>
              </div>
            </div>

            {/* Floating card 3 — right middle */}
            <div
              className="
              absolute top-1/2 -right-6
              -translate-y-1/2
              bg-white
              rounded-2xl
              shadow-xl shadow-slate-200
              border border-[#E2E8F0]
              px-4 py-3
            "
            >
              <p className="text-[11px] text-[#64748B] mb-1">Monthly Revenue</p>
              <p className="text-sm font-bold text-[#0F172A]">$24,500</p>
              <div className="flex items-center gap-1 mt-1">
                <div
                  className="
                  px-1.5 py-0.5
                  rounded-full
                  bg-emerald-50
                  text-emerald-600
                  text-[10px] font-semibold
                "
                >
                  ↑ 12%
                </div>
                <span className="text-[10px] text-[#94A3B8]">
                  vs last month
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
