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
    color: 'text-blue-400',
    iconBg: 'bg-blue-500/10 border-blue-500/10',
    title: 'Patient Management',
    description:
      'Complete patient records, medical history, lab reports and real-time status tracking from one dashboard.',
  },
  {
    icon: CalendarDays,
    color: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/10',
    title: 'Smart Appointments',
    description:
      'Schedule and track appointments with an intuitive calendar. Reduce no-shows with organized scheduling.',
  },
  {
    icon: Receipt,
    color: 'text-violet-400',
    iconBg: 'bg-violet-500/10 border-violet-500/10',
    title: 'Billing & Invoices',
    description:
      'Generate invoices instantly, track payments, and manage finances with automated calculations.',
  },
  {
    icon: Pill,
    color: 'text-orange-400',
    iconBg: 'bg-orange-500/10 border-orange-500/10',
    title: 'Pharmacy & Inventory',
    description:
      'Monitor stock levels, get low-stock alerts, track expiry dates and manage your pharmacy.',
  },
  {
    icon: BarChart3,
    color: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10 border-cyan-500/10',
    title: 'Analytics & Reports',
    description:
      'Real-time insights into hospital performance with visual charts and patient statistics.',
  },
  {
    icon: Shield,
    color: 'text-rose-400',
    iconBg: 'bg-rose-500/10 border-rose-500/10',
    title: 'Secure & Compliant',
    description:
      'Enterprise-grade security with role-based access, encryption, and audit logs.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-4 lg:py-6">
      <Container>
        {/* Header */}
        <div
          className="
          flex flex-col lg:flex-row
          lg:items-end lg:justify-between
          gap-4 lg:gap-12
          mb-14 lg:mb-16
        "
        >
          <AnimateIn className="max-w-xl">
            <span
              className="
              inline-flex items-center gap-2
              px-4 py-1.5 rounded-full
              bg-white/[0.04] border border-white/[0.06]
              text-indigo-400 text-xs font-semibold
              tracking-wide uppercase mb-4
            "
            >
              Features
            </span>
            <h2
              className="
              text-3xl lg:text-4xl font-bold
              text-white tracking-tight leading-tight
            "
            >
              Everything Your
              <br className="hidden sm:block" />
              Hospital Needs
            </h2>
          </AnimateIn>

          <AnimateIn delay={0.2} className="max-w-md">
            <p
              className="
              text-white/30 text-base lg:text-lg
              leading-relaxed lg:text-right
            "
            >
              A complete suite of tools designed for healthcare professionals to
              run their hospital efficiently.
            </p>
          </AnimateIn>
        </div>

        {/* Grid */}
        <StaggerContainer
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5"
          staggerDelay={0.08}
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <StaggerItem key={feature.title}>
                <div
                  className="
                  group h-full
                  bg-white/[0.02]
                  border border-white/[0.06]
                  rounded-2xl
                  p-6
                  hover:bg-white/[0.04]
                  hover:border-white/[0.1]
                  transition-all duration-300
                  cursor-default
                  flex flex-col
                "
                >
                  <div
                    className={`
                    w-10 h-10 rounded-xl
                    ${feature.iconBg}
                    border
                    flex items-center justify-center
                    mb-4
                  `}
                  >
                    <Icon className={`w-4.5 h-4.5 ${feature.color}`} />
                  </div>

                  <h3
                    className="
                    text-sm font-semibold
                    text-white/80
                    mb-2
                  "
                  >
                    {feature.title}
                  </h3>

                  <p
                    className="
                    text-sm text-white/25
                    leading-relaxed
                    flex-1
                  "
                  >
                    {feature.description}
                  </p>

                  <div
                    className="
                    flex items-center gap-1.5
                    text-xs font-medium
                    text-indigo-400
                    mt-4
                    opacity-0 translate-y-1
                    group-hover:opacity-100
                    group-hover:translate-y-0
                    transition-all duration-300
                  "
                  >
                    Learn more
                    <ArrowRight className="w-3 h-3" />
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
