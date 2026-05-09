'use client'

import Container from '@/components/shared/Container'
import AnimateIn from '@/components/shared/AnimateIn'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    quote:
      'MediCore transformed how we manage our 300-bed hospital. Patient records, appointments, and billing are seamlessly connected. We cut administrative time by 40% in the first month alone.',
    name: 'Dr. Sarah Mitchell',
    role: 'Chief Medical Officer',
    hospital: 'Boston General Hospital',
    initials: 'SM',
    color: 'from-indigo-400 to-violet-500',
    featured: true,
  },
  {
    quote:
      'The pharmacy inventory alerts saved us from three critical stockouts last quarter. The dashboard gives me a complete operational picture every morning.',
    name: 'Dr. James Okafor',
    role: 'Hospital Administrator',
    hospital: 'Lagos Medical Center',
    initials: 'JO',
    color: 'from-emerald-400 to-cyan-500',
    featured: false,
  },
  {
    quote:
      'Our staff learned the system in a single day. The billing module alone paid for the subscription in the first week of use.',
    name: 'Dr. Priya Nair',
    role: 'Head of Operations',
    hospital: 'Apollo Clinic, Mumbai',
    initials: 'PN',
    color: 'from-rose-400 to-pink-500',
    featured: false,
  },
]

function StarRow() {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

interface QuoteCardProps {
  t: (typeof testimonials)[0]
  large?: boolean
}

function QuoteCard({ t, large = false }: QuoteCardProps) {
  return (
    <div
      className={`h-full bg-white/[0.02] border border-white/[0.06]
      rounded-2xl flex flex-col
      hover:bg-white/[0.04] hover:border-white/[0.10]
      transition-colors duration-300
      ${large ? 'p-8 lg:p-10' : 'p-6'}`}
    >
      {/* Quote icon + stars */}
      <div className="flex items-center justify-between mb-5">
        <Quote
          className={`text-indigo-500/20 ${large ? 'w-10 h-10' : 'w-7 h-7'}`}
        />
        <StarRow />
      </div>

      {/* Quote text */}
      <p
        className={`text-white/50 leading-relaxed flex-1 mb-6
        ${large ? 'text-base lg:text-lg' : 'text-sm'}`}
      >
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-5 border-t border-white/[0.06]">
        <div
          className={`rounded-full flex-shrink-0
          bg-gradient-to-br ${t.color}
          flex items-center justify-center border border-white/[0.10]
          ${large ? 'w-11 h-11' : 'w-9 h-9'}`}
        >
          <span
            className={`text-white font-bold
            ${large ? 'text-sm' : 'text-xs'}`}
          >
            {t.initials}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-white/80 text-sm font-semibold truncate">
            {t.name}
          </p>
          <p className="text-white/30 text-xs truncate">
            {t.role} · {t.hospital}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const featured = testimonials.find((t) => t.featured)!
  const others = testimonials.filter((t) => !t.featured)

  return (
    <section id="testimonials" className="py-20 lg:py-28">
      <Container>
        {/* Header — left aligned */}
        <div className="max-w-xl mb-14 lg:mb-16">
          <AnimateIn>
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5
              rounded-full bg-white/[0.04] border border-white/[0.06]
              text-indigo-400 text-xs font-semibold tracking-wide
              uppercase mb-4"
            >
              Testimonials
            </span>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2
              className="text-3xl lg:text-4xl font-bold text-white
              tracking-tight leading-tight mb-4"
            >
              What healthcare teams
              <br />
              are saying
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-white/30 text-base lg:text-lg leading-relaxed">
              Hospitals and clinics across the globe rely on MediCore for their
              daily operations.
            </p>
          </AnimateIn>
        </div>

        {/* Asymmetric layout — large left, stacked right */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Featured — large card */}
          <AnimateIn delay={0.15}>
            <QuoteCard t={featured} large />
          </AnimateIn>

          {/* Two stacked cards */}
          <div className="flex flex-col gap-5">
            {others.map((t, i) => (
              <AnimateIn key={t.name} delay={0.2 + i * 0.1}>
                <QuoteCard t={t} />
              </AnimateIn>
            ))}
          </div>
        </div>

        {/* Bottom stats bar */}
        <AnimateIn delay={0.3}>
          <div
            className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6
            bg-white/[0.02] border border-white/[0.06] rounded-2xl
            p-6 lg:p-8"
          >
            {[
              { value: '500+', label: 'Hospitals worldwide' },
              { value: '98%', label: 'Customer satisfaction' },
              { value: '4.9', label: 'Average rating' },
              { value: '24/7', label: 'Support available' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl lg:text-3xl font-black text-white">
                  {stat.value}
                </p>
                <p className="text-white/30 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </AnimateIn>
      </Container>
    </section>
  )
}
