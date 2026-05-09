'use client'

import { motion } from 'framer-motion'
import Container from '@/components/shared/Container'
import AnimateIn from '@/components/shared/AnimateIn'
import StaggerContainer from '@/components/shared/StaggerContainer'
import StaggerItem from '@/components/shared/StaggerItem'

const testimonials = [
  {
    quote:
      'MediCore transformed how we manage our 300-bed hospital. Patient records, appointments, and billing are now seamlessly connected. We cut admin time by 40% in the first month.',
    name: 'Dr. Sarah Mitchell',
    role: 'Chief Medical Officer',
    hospital: 'Boston General Hospital',
    initials: 'SM',
    color: 'from-indigo-400 to-violet-500',
    stars: 5,
  },
  {
    quote:
      'The pharmacy inventory alerts alone saved us from three critical stockouts. The dashboard gives me a complete picture of our operations every morning before rounds.',
    name: 'Dr. James Okafor',
    role: 'Hospital Administrator',
    hospital: 'Lagos Medical Center',
    initials: 'JO',
    color: 'from-emerald-400 to-cyan-500',
    stars: 5,
  },
  {
    quote:
      'Switching from paper-based records to MediCore was seamless. Our staff learned the system in a day. The billing module alone paid for the subscription in week one.',
    name: 'Dr. Priya Nair',
    role: 'Head of Operations',
    hospital: 'Apollo Clinic, Mumbai',
    initials: 'PN',
    color: 'from-rose-400 to-pink-500',
    stars: 5,
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5 mb-4">
      {Array.from({ length: count }).map((_, i) => (
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

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-28">
      <Container>
        {/* Header */}
        <div
          className="flex flex-col items-center text-center max-w-2xl
          mx-auto mb-16"
        >
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
              Trusted by Healthcare
              <br className="hidden sm:block" />
              Professionals <span className="text-indigo-400">Worldwide</span>
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-white/30 text-base lg:text-lg leading-relaxed">
              Hospitals and clinics across the globe use MediCore to deliver
              better patient care.
            </p>
          </AnimateIn>
        </div>

        {/* Cards */}
        <StaggerContainer
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          staggerDelay={0.1}
        >
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group h-full bg-white/[0.02] border border-white/[0.06]
                  rounded-2xl p-6 flex flex-col
                  hover:bg-white/[0.04] hover:border-white/[0.10]
                  hover:shadow-lg hover:shadow-black/30
                  transition-colors duration-300"
              >
                {/* Stars */}
                <StarRating count={t.stars} />

                {/* Quote */}
                <p className="text-white/50 text-sm leading-relaxed flex-1 mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div
                  className="flex items-center gap-3 pt-5
                  border-t border-white/[0.06]"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex-shrink-0
                    bg-gradient-to-br ${t.color}
                    flex items-center justify-center
                    border border-white/[0.10]`}
                  >
                    <span className="text-white text-xs font-bold">
                      {t.initials}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white/80 text-sm font-semibold truncate">
                      {t.name}
                    </p>
                    <p className="text-white/30 text-xs truncate">{t.role}</p>
                    <p className="text-indigo-400/60 text-xs truncate">
                      {t.hospital}
                    </p>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Bottom trust bar */}
        <AnimateIn delay={0.3}>
          <div
            className="mt-14 flex flex-col sm:flex-row items-center
            justify-center gap-8 sm:gap-12"
          >
            {[
              { value: '500+', label: 'Hospitals worldwide' },
              { value: '98%', label: 'Customer satisfaction' },
              { value: '4.9', label: 'Average rating' },
              { value: '24/7', label: 'Support available' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-white/30 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </AnimateIn>
      </Container>
    </section>
  )
}
