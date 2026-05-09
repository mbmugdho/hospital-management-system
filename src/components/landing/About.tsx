'use client'

import Container from '@/components/shared/Container'
import AnimateIn from '@/components/shared/AnimateIn'
import { HeartPulse, Target, Lightbulb, Layers } from 'lucide-react'

const values = [
  {
    icon: Target,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
    title: 'Purpose-Built',
    description:
      'Every feature exists because a real hospital needed it. No bloat, no unused modules — just tools that solve actual problems healthcare teams face daily.',
  },
  {
    icon: Lightbulb,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
    title: 'Simplicity First',
    description:
      'A doctor should not need a training manual to check appointments. MediCore is designed to feel familiar from the first click.',
  },
  {
    icon: Layers,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'Modern Stack',
    description:
      'Built on a modern foundation — fast, secure, and reliable. Designed to scale from a small clinic to a multi-department hospital without compromise.',
  },
]

const techStack = [
  'Next.js',
  'React',
  'TypeScript',
  'Tailwind CSS',
  'Supabase',
  'Framer Motion',
  'Recharts',
]

export default function About() {
  return (
    <section id="about" className="py-4 lg:py-6">
      <Container>
        {/* Top — mission statement with accent line */}
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 mb-20">
          {/* Left — heading */}
          <div>
            <AnimateIn>
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5
                rounded-full bg-white/[0.04] border border-white/[0.06]
                text-indigo-400 text-xs font-semibold tracking-wide
                uppercase mb-4"
              >
                About MediCore
              </span>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <h2
                className="text-3xl lg:text-4xl font-bold text-white
                tracking-tight leading-tight"
              >
                Built for the people
                <br />
                who save lives
              </h2>
            </AnimateIn>
          </div>

          {/* Right — mission text with accent border */}
          <div className="relative">
            {/* Vertical accent line */}
            <div
              className="absolute left-0 top-0 bottom-0 w-px
              bg-gradient-to-b from-indigo-500/50 via-violet-500/30
              to-transparent hidden lg:block"
            />

            <div className="lg:pl-10">
              <AnimateIn delay={0.15}>
                <p
                  className="text-white/50 text-lg lg:text-xl
                  leading-relaxed mb-6 font-light"
                >
                  Hospitals run on coordination. Patients, appointments,
                  prescriptions, invoices — everything connected, everything
                  moving. But most management tools were not built for how
                  healthcare actually works.
                </p>
              </AnimateIn>
              <AnimateIn delay={0.25}>
                <p className="text-white/30 text-base leading-relaxed">
                  MediCore was built to change that. A single platform where
                  doctors focus on patients, not paperwork. Where administrators
                  see their entire operation in one glance. Where pharmacists
                  catch stockouts before they happen. Simple, fast, and built
                  for the way hospitals actually run.
                </p>
              </AnimateIn>
            </div>
          </div>
        </div>

        {/* Middle — three value pillars */}
        <div className="grid sm:grid-cols-3 gap-6 lg:gap-10 mb-16">
          {values.map((v, i) => {
            const Icon = v.icon
            return (
              <AnimateIn key={v.title} delay={0.1 + i * 0.1}>
                <div className="group">
                  {/* Icon */}
                  <div
                    className={`w-11 h-11 rounded-xl border flex items-center
                    justify-center mb-4 transition-all duration-300
                    shadow-lg ${v.bg}`}
                  >
                    <Icon className={`w-5 h-5 ${v.color}`} />
                  </div>

                  <h3 className="text-white/90 text-base font-semibold mb-2">
                    {v.title}
                  </h3>

                  <p className="text-white/30 text-sm leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </AnimateIn>
            )
          })}
        </div>

        {/* Bottom — tech stack strip */}
        <AnimateIn delay={0.3}>
          <div
            className="flex flex-col sm:flex-row sm:items-center
            gap-4 sm:gap-6 py-6 border-t border-white/[0.06]"
          >
            <div className="flex items-center gap-3 flex-shrink-0">
              <div
                className="w-8 h-8 rounded-lg bg-indigo-500/10
                border border-indigo-500/20 flex items-center
                justify-center"
              >
                <HeartPulse className="w-4 h-4 text-indigo-400" />
              </div>
              <span
                className="text-white/40 text-xs font-medium uppercase
                tracking-wider"
              >
                Built with
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-full text-xs
                  font-medium text-white/40 bg-white/[0.03]
                  border border-white/[0.06]
                  hover:text-white/60 hover:border-white/[0.10]
                  transition-colors duration-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </AnimateIn>
      </Container>
    </section>
  )
}
