'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Container from '@/components/shared/Container'
import AnimateIn from '@/components/shared/AnimateIn'
import {
  HeartPulse,
  ArrowRight,
  CheckCircle2,
  Shield,
  Clock,
} from 'lucide-react'

export default function CtaBanner() {
  return (
    <section className="py-8 lg:py-10">
      <Container>
        <AnimateIn>
          <div
            className="
            relative overflow-hidden
            rounded-2xl lg:rounded-3xl
            border border-white/[0.08]
            bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent
            p-8 lg:p-14
            animate-border-glow
          "
          >
            {/* Glow */}
            <div
              className="
              absolute -top-20 -right-20
              w-[400px] h-[400px] rounded-full
              bg-indigo-500/10 blur-3xl
              animate-glow-pulse
              pointer-events-none
            "
            />

            <div
              className="
              relative
              flex flex-col lg:flex-row
              lg:items-center lg:justify-between
              gap-8 lg:gap-16
            "
            >
              {/* Left */}
              <div className="max-w-lg">
                {/* Pulsing icon */}
                <div className="relative w-fit mb-5">
                  <div
                    className="
                    w-12 h-12 rounded-xl
                    bg-white/[0.06] border border-white/[0.08]
                    flex items-center justify-center
                  "
                  >
                    <HeartPulse className="w-6 h-6 text-indigo-400" />
                  </div>
                  {/* Pulse ring */}
                  <div
                    className="
                    absolute inset-0 rounded-xl
                    border border-indigo-400/30
                    animate-pulse-ring
                  "
                  />
                </div>

                <h2
                  className="
                  text-2xl lg:text-3xl font-bold
                  text-white tracking-tight leading-tight mb-3
                "
                >
                  Ready to Transform
                  <br className="hidden sm:block" />
                  Your Hospital?
                </h2>

                <p className="text-white/30 text-base leading-relaxed mb-6">
                  Join 500+ hospitals already using MediCore to streamline
                  operations and deliver better patient care.
                </p>

                <div className="flex flex-wrap gap-4">
                  {[
                    { icon: CheckCircle2, text: 'No credit card' },
                    { icon: Shield, text: 'HIPAA compliant' },
                    { icon: Clock, text: '5 min setup' },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <div
                        key={item.text}
                        className="flex items-center gap-1.5 text-xs text-white/25"
                      >
                        <Icon className="w-3.5 h-3.5 text-indigo-400/50" />
                        {item.text}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col gap-3 w-full lg:w-auto lg:min-w-[260px]">
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className="
                      w-full inline-flex items-center justify-center
                      bg-white text-black hover:bg-white/90
                      rounded-xl h-12 font-bold text-sm
                      shadow-lg shadow-white/10
                    "
                  >
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </motion.button>
                </Link>

                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className="
                      w-full inline-flex items-center justify-center
                      bg-white/[0.04] text-white/60
                      border border-white/[0.08]
                      hover:bg-white/[0.08] hover:text-white
                      rounded-xl h-12 font-semibold text-sm
                    "
                  >
                    Sign In Instead
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </AnimateIn>
      </Container>
    </section>
  )
}
