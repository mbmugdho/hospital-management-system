'use client'

import Container from '@/components/shared/Container'
import AnimateIn from '@/components/shared/AnimateIn'
import CountUp from '@/components/shared/CountUp'
import { Building2, Users, Activity, Headset } from 'lucide-react'

const stats = [
  { icon: Building2, value: '500+', label: 'Hospitals Onboarded' },
  { icon: Users, value: '50,000+', label: 'Patients Managed' },
  { icon: Activity, value: '99.9%', label: 'Uptime Guaranteed' },
  { icon: Headset, value: '24/7', label: 'Customer Support' },
]

export default function Stats() {
  return (
    <section className="py-10 lg:py-16">
      <Container>
        <div
          className="
          border border-white/[0.06]
          bg-white/[0.02]
          backdrop-blur-sm
          rounded-2xl
          p-8 lg:p-12
        "
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <AnimateIn
                  key={stat.label}
                  delay={index * 0.1}
                  className="
                    relative flex flex-col items-center
                    text-center group
                  "
                >
                  {/* Divider */}
                  {index !== 0 && (
                    <div
                      className="
                      hidden lg:block
                      absolute left-0 top-1/2 -translate-y-1/2
                      w-px h-12
                      bg-gradient-to-b from-transparent via-white/[0.08] to-transparent
                    "
                    />
                  )}

                  {/* Icon */}
                  <div
                    className="
                    w-10 h-10 rounded-xl
                    bg-white/[0.04]
                    border border-white/[0.06]
                    flex items-center justify-center
                    mb-4
                    group-hover:bg-white/[0.08]
                    transition-all duration-300
                  "
                  >
                    <Icon className="w-4 h-4 text-indigo-400" />
                  </div>

                  {/* Value */}
                  <CountUp
                    target={stat.value}
                    className="
                      text-2xl lg:text-3xl
                      font-bold text-white
                      tracking-tight mb-1
                    "
                  />

                  {/* Label */}
                  <p className="text-xs text-white/30 font-medium">
                    {stat.label}
                  </p>
                </AnimateIn>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
