'use client'

import Container from '@/components/shared/Container'
import AnimateIn from '@/components/shared/AnimateIn'
import { UserPlus, LayoutDashboard, TrendingUp } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: UserPlus,
    color: 'text-indigo-400',
    border: 'border-indigo-500/20',
    bg: 'bg-indigo-500/10',
    dot: 'bg-indigo-500',
    title: 'Create Your Account',
    description:
      'Sign up in under 60 seconds. No credit card required. Your hospital workspace is ready instantly — add your name, hospital, and you are in.',
  },
  {
    number: '02',
    icon: LayoutDashboard,
    color: 'text-violet-400',
    border: 'border-violet-500/20',
    bg: 'bg-violet-500/10',
    dot: 'bg-violet-500',
    title: 'Set Up Your Hospital',
    description:
      'Add staff, register patients, configure departments. Import existing records via CSV or enter them manually. The guided setup takes minutes, not hours.',
  },
  {
    number: '03',
    icon: TrendingUp,
    color: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/10',
    dot: 'bg-emerald-500',
    title: 'Manage Everything',
    description:
      'Track appointments, generate invoices, monitor pharmacy stock, view real-time analytics. One dashboard for your entire hospital operation.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28">
      <Container>
        {/* Header — left aligned */}
        <div className="max-w-xl mb-16 lg:mb-20">
          <AnimateIn>
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5
              rounded-full bg-white/[0.04] border border-white/[0.06]
              text-indigo-400 text-xs font-semibold tracking-wide
              uppercase mb-4"
            >
              How It Works
            </span>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2
              className="text-3xl lg:text-4xl font-bold text-white
              tracking-tight leading-tight mb-4"
            >
              Three steps to a
              <br />
              smarter hospital
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-white/30 text-base lg:text-lg leading-relaxed">
              No training sessions. No month-long onboarding. MediCore is built
              to be intuitive from day one.
            </p>
          </AnimateIn>
        </div>

        {/* Steps — vertical timeline */}
        <div className="relative">
          {/* Vertical connector line */}
          <div
            className="absolute left-[39px] lg:left-[47px] top-0 bottom-0
            w-px bg-gradient-to-b from-indigo-500/30 via-violet-500/20
            to-emerald-500/30 hidden sm:block"
          />

          <div className="space-y-6 lg:space-y-0">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <AnimateIn key={step.number} delay={0.1 + i * 0.15}>
                  <div
                    className="flex gap-6 lg:gap-10 relative
                    lg:py-10 group"
                  >
                    {/* Left — number + dot */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      {/* Step number — large */}
                      <div
                        className="w-[80px] lg:w-[96px] h-[80px] lg:h-[96px]
                        rounded-2xl bg-white/[0.02] border border-white/[0.06]
                        flex items-center justify-center relative
                        group-hover:bg-white/[0.04] group-hover:border-white/[0.10]
                        transition-all duration-300"
                      >
                        <span
                          className="text-3xl lg:text-4xl font-black
                          text-white/[0.06] group-hover:text-white/[0.10]
                          transition-colors duration-300 select-none"
                        >
                          {step.number}
                        </span>

                        {/* Floating icon badge */}
                        <div
                          className={`absolute -bottom-2 -right-2 w-8 h-8
                          rounded-xl ${step.bg} border ${step.border}
                          flex items-center justify-center shadow-lg`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${step.color}`} />
                        </div>
                      </div>

                      {/* Timeline dot — hidden on mobile */}
                      <div
                        className={`hidden sm:block w-3 h-3 rounded-full
                        ${step.dot} mt-4 ring-4 ring-black`}
                      />
                    </div>

                    {/* Right — content */}
                    <div className="pt-2 lg:pt-4 pb-4 flex-1 min-w-0">
                      <h3
                        className="text-lg lg:text-xl font-semibold
                        text-white/90 mb-2"
                      >
                        {step.title}
                      </h3>
                      <p
                        className="text-white/30 text-sm lg:text-base
                        leading-relaxed max-w-lg"
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </AnimateIn>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
