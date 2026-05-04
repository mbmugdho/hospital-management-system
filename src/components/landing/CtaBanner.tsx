import Link from 'next/link'
import Container from '@/components/shared/Container'
import {
  HeartPulse,
  ArrowRight,
  CheckCircle2,
  Shield,
  Clock,
} from 'lucide-react'

export default function CtaBanner() {
  return (
    <section className="relative py-20 lg:py-24 overflow-hidden">
      {/* ── Full Width Blue Background ── */}
      <div
        className="
        absolute inset-0
        bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8]
      "
      />

      {/* ── Background Decorations ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top right glow */}
        <div
          className="
          absolute -top-32 -right-32
          w-[500px] h-[500px] rounded-full
          bg-white/[0.07]
          blur-3xl
        "
        />
        {/* Bottom left glow */}
        <div
          className="
          absolute -bottom-32 -left-32
          w-[400px] h-[400px] rounded-full
          bg-white/[0.05]
          blur-3xl
        "
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <Container className="relative">
        <div
          className="
          flex flex-col lg:flex-row
          lg:items-center lg:justify-between
          gap-10 lg:gap-16
        "
        >
          {/* ══════════════════════════
              LEFT — Text Content
          ══════════════════════════ */}
          <div className="max-w-xl">
            {/* Icon */}
            <div
              className="
              w-14 h-14 rounded-2xl
              bg-white/[0.12]
              border border-white/[0.15]
              flex items-center justify-center
              mb-6
            "
            >
              <HeartPulse className="w-7 h-7 text-white" />
            </div>

            {/* Heading */}
            <h2
              className="
              text-3xl lg:text-4xl
              font-bold text-white
              tracking-tight
              leading-tight
              mb-4
            "
            >
              Ready to Transform
              <br className="hidden sm:block" />
              Your Hospital?
            </h2>

            {/* Subtext */}
            <p
              className="
              text-blue-100
              text-base lg:text-lg
              leading-relaxed
              mb-8
            "
            >
              Join 500+ hospitals already using MediCore to streamline their
              operations, reduce errors, and deliver better patient care every
              single day.
            </p>

            {/* Trust badges */}
            <div
              className="
              flex flex-col sm:flex-row
              gap-4 sm:gap-6
            "
            >
              {[
                { icon: CheckCircle2, text: 'No credit card required' },
                { icon: Shield, text: 'HIPAA compliant' },
                { icon: Clock, text: 'Setup in 5 minutes' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.text}
                    className="
                      flex items-center gap-2
                      text-sm text-blue-100
                    "
                  >
                    <Icon className="w-4 h-4 text-white flex-shrink-0" />
                    {item.text}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ══════════════════════════
              RIGHT — CTA Card
          ══════════════════════════ */}
          <div
            className="
            w-full lg:w-auto
            lg:min-w-[340px]
          "
          >
            <div
              className="
              bg-white/[0.1]
              backdrop-blur-sm
              border border-white/[0.15]
              rounded-2xl
              p-8
            "
            >
              {/* Card heading */}
              <h3
                className="
                text-xl font-bold text-white
                mb-2
              "
              >
                Start your free trial
              </h3>
              <p
                className="
                text-sm text-blue-100
                leading-relaxed
                mb-6
              "
              >
                Get full access to all features for 14 days. No credit card
                needed.
              </p>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <Link href="/register">
                  <button
                    className="
                    w-full
                    inline-flex items-center justify-center
                    bg-white text-[#3B82F6]
                    hover:bg-blue-50
                    rounded-xl h-12
                    font-bold text-sm
                    shadow-lg
                    hover:-translate-y-0.5
                    transition-all duration-300
                  "
                  >
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </Link>

                <Link href="/login">
                  <button
                    className="
                    w-full
                    inline-flex items-center justify-center
                    bg-transparent
                    text-white
                    border border-white/30
                    hover:bg-white/[0.08]
                    hover:border-white/50
                    rounded-xl h-12
                    font-semibold text-sm
                    hover:-translate-y-0.5
                    transition-all duration-300
                  "
                  >
                    Sign In Instead
                  </button>
                </Link>
              </div>

              {/* Mini social proof */}
              <div
                className="
                mt-6 pt-6
                border-t border-white/[0.1]
                flex items-center gap-3
              "
              >
                {/* Avatar stack */}
                <div className="flex -space-x-2">
                  {[
                    'from-blue-300 to-blue-400',
                    'from-emerald-300 to-emerald-400',
                    'from-violet-300 to-violet-400',
                  ].map((color, i) => (
                    <div
                      key={i}
                      className={`
                        w-7 h-7 rounded-full
                        bg-gradient-to-br ${color}
                        border-2 border-white/20
                        flex items-center justify-center
                      `}
                    >
                      <span className="text-white text-[8px] font-bold">
                        {['JT', 'MG', 'DP'][i]}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-blue-100">
                  <span className="font-semibold text-white">2,400+</span>{' '}
                  signed up this month
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
