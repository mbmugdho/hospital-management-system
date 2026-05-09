'use client'

import { motion } from 'framer-motion'
import Container from '@/components/shared/Container'
import AnimateIn from '@/components/shared/AnimateIn'
import StaggerContainer from '@/components/shared/StaggerContainer'
import StaggerItem from '@/components/shared/StaggerItem'
import { UserPlus, LayoutDashboard, TrendingUp, ArrowRight } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: UserPlus,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
    glow: 'group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 group-hover:shadow-indigo-500/10',
    title: 'Create Your Account',
    description:
      'Sign up in under 60 seconds. No credit card required. Your hospital profile is ready immediately after registration.',
    detail: 'Free forever on the Starter plan',
  },
  {
    number: '02',
    icon: LayoutDashboard,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
    glow: 'group-hover:bg-violet-500/20 group-hover:border-violet-500/30 group-hover:shadow-violet-500/10',
    title: 'Set Up Your Hospital',
    description:
      'Add your staff, import patients, and configure departments. Our guided setup gets you operational in minutes.',
    detail: 'Import from CSV or add manually',
  },
  {
    number: '03',
    icon: TrendingUp,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    glow: 'group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 group-hover:shadow-emerald-500/10',
    title: 'Manage and Grow',
    description:
      'Track appointments, generate invoices, monitor pharmacy stock and view real-time analytics — all from one place.',
    detail: 'Live data updated instantly',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28">
      <Container>
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
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
              Up and Running
              <br className="hidden sm:block" />
              in <span className="text-indigo-400">Three Steps</span>
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-white/30 text-base lg:text-lg leading-relaxed">
              No lengthy onboarding. No training sessions. MediCore is designed
              to be intuitive from day one.
            </p>
          </AnimateIn>
        </div>

        {/* Steps */}
        <StaggerContainer
          className="grid sm:grid-cols-3 gap-6 lg:gap-8 relative"
          staggerDelay={0.1}
        >
          {/* Connector line — desktop only */}
          <div
            className="hidden sm:block absolute top-12 left-[calc(16.66%+16px)]
            right-[calc(16.66%+16px)] h-px bg-gradient-to-r
            from-indigo-500/30 via-violet-500/30 to-emerald-500/30
            pointer-events-none"
          />

          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <StaggerItem key={step.number}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="group relative bg-white/[0.02] border border-white/[0.06]
                    rounded-2xl p-6 lg:p-8 flex flex-col
                    hover:bg-white/[0.04] hover:border-white/[0.10]
                    hover:shadow-lg hover:shadow-black/30
                    transition-colors duration-300"
                >
                  {/* Step number */}
                  <span
                    className="text-5xl font-black text-white/[0.04]
                    absolute top-5 right-6 select-none leading-none"
                  >
                    {step.number}
                  </span>

                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-2xl border flex items-center
                    justify-center mb-5 flex-shrink-0 shadow-lg
                    transition-all duration-300 ${step.bg} ${step.glow}`}
                  >
                    <Icon className={`w-5 h-5 ${step.color}`} />
                  </div>

                  <h3 className="text-base font-semibold text-white/90 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-sm text-white/30 leading-relaxed flex-1 mb-4">
                    {step.description}
                  </p>

                  {/* Detail pill */}
                  <span
                    className="inline-flex items-center gap-1.5 text-xs
                    font-medium text-white/25 bg-white/[0.03]
                    border border-white/[0.06] px-3 py-1.5 rounded-full w-fit"
                  >
                    <span className="w-1 h-1 rounded-full bg-indigo-400" />
                    {step.detail}
                  </span>

                  {/* Arrow — not on last step */}
                  {index < steps.length - 1 && (
                    <div className="sm:hidden flex justify-center mt-6">
                      <ArrowRight className="w-4 h-4 text-white/10 rotate-90" />
                    </div>
                  )}
                </motion.div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </Container>
    </section>
  )
}
