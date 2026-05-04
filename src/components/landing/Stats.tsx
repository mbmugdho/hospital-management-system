'use client'

import Container from '@/components/shared/Container'
import AnimateIn from '@/components/shared/AnimateIn'
import CountUp from '@/components/shared/CountUp'
import { Building2, Users, Activity, Headset } from 'lucide-react'

const stats = [
  {
    icon: Building2,
    value: '500+',
    label: 'Hospitals Onboarded',
    desc: 'Across 30+ countries',
  },
  {
    icon: Users,
    value: '50,000+',
    label: 'Patients Managed',
    desc: 'Every single month',
  },
  {
    icon: Activity,
    value: '99.9%',
    label: 'Uptime Guaranteed',
    desc: 'Enterprise reliability',
  },
  {
    icon: Headset,
    value: '24/7',
    label: 'Customer Support',
    desc: 'Always here to help',
  },
]

export default function Stats() {
  return (
    <section className="relative bg-[#1E293B] py-16 lg:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E293B] via-[#1E3A5F] to-[#1E293B] opacity-50" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <Container className="relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <AnimateIn
                key={stat.label}
                delay={index * 0.15}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Divider */}
                {index !== 0 && (
                  <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-[#475569] to-transparent" />
                )}

                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-white/[0.07] border border-white/[0.08] flex items-center justify-center mb-4 group-hover:bg-white/[0.12] group-hover:border-white/[0.15] transition-all duration-300">
                  <Icon className="w-5 h-5 text-[#93C5FD]" />
                </div>

                {/* Value — count up */}
                <CountUp
                  target={stat.value}
                  className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-1"
                />

                {/* Label */}
                <p className="text-sm font-semibold text-[#CBD5E1] mb-1">
                  {stat.label}
                </p>

                {/* Description */}
                <p className="text-xs text-[#64748B]">{stat.desc}</p>
              </AnimateIn>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
