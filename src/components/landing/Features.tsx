'use client'

import Container from '@/components/shared/Container'
import AnimateIn from '@/components/shared/AnimateIn'
import StaggerContainer from '@/components/shared/StaggerContainer'
import StaggerItem from '@/components/shared/StaggerItem'
import {
  Users,
  CalendarDays,
  Receipt,
  Pill,
  BarChart3,
  Shield,
  ArrowRight,
} from 'lucide-react'

const features = [
  {
    icon: Users,
    color: 'bg-blue-50 text-[#3B82F6] border-blue-100',
    hoverBorder: 'group-hover:border-blue-200',
    title: 'Patient Management',
    description:
      'Maintain complete patient records, medical history, lab reports and real-time status tracking — all from one centralized dashboard.',
    highlights: ['Medical History', 'Lab Reports', 'Status Tracking'],
  },
  {
    icon: CalendarDays,
    color: 'bg-emerald-50 text-[#10B981] border-emerald-100',
    hoverBorder: 'group-hover:border-emerald-200',
    title: 'Smart Appointments',
    description:
      'Schedule, reschedule and track appointments with an intuitive calendar view. Reduce no-shows with organized time slot management.',
    highlights: ['Calendar View', 'Time Slots', 'Auto Reminders'],
  },
  {
    icon: Receipt,
    color: 'bg-violet-50 text-[#8B5CF6] border-violet-100',
    hoverBorder: 'group-hover:border-violet-200',
    title: 'Billing & Invoices',
    description:
      'Generate professional invoices instantly, track payment statuses, and manage financial records with automated tax calculations.',
    highlights: ['Auto Invoicing', 'Payment Tracking', 'Tax Reports'],
  },
  {
    icon: Pill,
    color: 'bg-orange-50 text-[#F97316] border-orange-100',
    hoverBorder: 'group-hover:border-orange-200',
    title: 'Pharmacy & Inventory',
    description:
      'Monitor medicine stock levels in real-time, get low-stock alerts, track expiry dates and manage your entire pharmacy inventory.',
    highlights: ['Stock Alerts', 'Expiry Tracking', 'Supplier Mgmt'],
  },
  {
    icon: BarChart3,
    color: 'bg-cyan-50 text-[#06B6D4] border-cyan-100',
    hoverBorder: 'group-hover:border-cyan-200',
    title: 'Analytics & Reports',
    description:
      'Get real-time insights into hospital performance with visual charts, revenue trends, and patient statistics at a glance.',
    highlights: ['Revenue Charts', 'Patient Stats', 'Custom Reports'],
  },
  {
    icon: Shield,
    color: 'bg-rose-50 text-[#F43F5E] border-rose-100',
    hoverBorder: 'group-hover:border-rose-200',
    title: 'Secure & Compliant',
    description:
      'Enterprise-grade security with role-based access control, data encryption, and audit logs. Your patient data is always safe.',
    highlights: ['Role-Based Access', 'Encryption', 'Audit Logs'],
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-[#F8FAFC]">
      <Container>
        {/* ── Section Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 lg:gap-12 mb-14 lg:mb-16">
          <AnimateIn className="max-w-xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#3B82F6] text-xs font-semibold tracking-wide uppercase mb-4">
              Features
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight leading-tight">
              Everything Your
              <br className="hidden sm:block" />
              Hospital Needs
            </h2>
          </AnimateIn>

          <AnimateIn delay={0.2} className="max-w-md">
            <p className="text-[#64748B] text-base lg:text-lg leading-relaxed lg:text-right">
              A complete suite of tools designed for healthcare professionals to
              run their hospital efficiently and deliver better patient care.
            </p>
          </AnimateIn>
        </div>

        {/* ── Feature Grid (staggered) ── */}
        <StaggerContainer
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
          staggerDelay={0.1}
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <StaggerItem key={feature.title}>
                <div
                  className={`
                    group bg-white rounded-2xl
                    border border-[#E2E8F0]
                    p-6 lg:p-7
                    hover:shadow-xl hover:shadow-slate-100
                    hover:-translate-y-1
                    ${feature.hoverBorder}
                    transition-all duration-300
                    cursor-default flex flex-col
                    h-full
                  `}
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${feature.color} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed mb-5 flex-1">
                    {feature.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {feature.highlights.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[10px] font-semibold text-[#64748B] uppercase tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-[#3B82F6] opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                    Learn more
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </Container>
    </section>
  )
}
