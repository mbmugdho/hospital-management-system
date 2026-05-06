'use client'

import Link from 'next/link'
import Container from '@/components/shared/Container'
import AnimateIn from '@/components/shared/AnimateIn'
import StaggerContainer from '@/components/shared/StaggerContainer'
import StaggerItem from '@/components/shared/StaggerItem'
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    desc: 'For small clinics and independent practices.',
    price: '$29',
    period: '/month',
    popular: false,
    features: [
      'Up to 500 patients',
      'Appointment scheduling',
      'Basic billing & invoices',
      '2 staff accounts',
      'Email support',
    ],
    cta: 'Get Started',
    href: '/register',
  },
  {
    name: 'Professional',
    desc: 'For growing hospitals and multi-department clinics.',
    price: '$79',
    period: '/month',
    popular: true,
    features: [
      'Unlimited patients',
      'Advanced scheduling',
      'Full billing & invoicing',
      'Pharmacy management',
      '20 staff accounts',
      'Priority support',
      'Analytics dashboard',
    ],
    cta: 'Get Started',
    href: '/register',
  },
  {
    name: 'Enterprise',
    desc: 'For large hospital networks with complex needs.',
    price: 'Custom',
    period: '',
    popular: false,
    features: [
      'Everything in Professional',
      'Unlimited staff accounts',
      'Custom integrations & API',
      'Dedicated account manager',
      'SLA guarantee',
      'On-premise option',
    ],
    cta: 'Contact Sales',
    href: '/register',
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-10 lg:py-16">
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
              Pricing
            </span>
            <h2
              className="
              text-3xl lg:text-4xl font-bold
              text-white tracking-tight leading-tight
            "
            >
              Simple, Transparent
              <br className="hidden sm:block" />
              Pricing for Everyone
            </h2>
          </AnimateIn>

          <AnimateIn delay={0.2} className="max-w-md">
            <p
              className="
              text-white/30 text-base lg:text-lg
              leading-relaxed lg:text-right
            "
            >
              Choose the plan that fits your hospital. No hidden fees. Cancel
              anytime.
            </p>
          </AnimateIn>
        </div>

        {/* Plans */}
        <StaggerContainer
          className="grid md:grid-cols-3 gap-5 lg:gap-6 items-start"
          staggerDelay={0.12}
        >
          {plans.map((plan) => (
            <StaggerItem key={plan.name}>
              <div
                className={`
                  relative rounded-2xl border
                  flex flex-col
                  transition-all duration-300
                  ${
                    plan.popular
                      ? `
                      border-indigo-500/30
                      bg-white/[0.04]
                      shadow-2xl shadow-indigo-500/10
                      ring-1 ring-indigo-500/20
                    `
                      : `
                      border-white/[0.06]
                      bg-white/[0.02]
                      hover:bg-white/[0.04]
                      hover:border-white/[0.1]
                    `
                  }
                `}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span
                      className="
                      inline-flex items-center gap-1.5
                      bg-gradient-to-r from-indigo-500 to-purple-500
                      text-white px-4 py-1.5
                      rounded-full text-xs font-bold
                      shadow-md shadow-indigo-500/30
                    "
                    >
                      <Sparkles className="w-3 h-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-6 lg:p-7 flex flex-col flex-1">
                  <div className="mb-5">
                    <h3 className="text-base font-bold text-white/80 mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-white/25 leading-relaxed">
                      {plan.desc}
                    </p>
                  </div>

                  <div className="flex items-end gap-1.5 mb-5">
                    <span
                      className="
                      text-3xl lg:text-4xl font-bold
                      text-white tracking-tight leading-none
                    "
                    >
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-white/25 text-sm mb-1">
                        {plan.period}
                      </span>
                    )}
                  </div>

                  <div
                    className={`
                    border-t mb-5
                    ${
                      plan.popular
                        ? 'border-indigo-500/20'
                        : 'border-white/[0.06]'
                    }
                  `}
                  />

                  <ul className="flex flex-col gap-3 mb-7 flex-1">
                    {plan.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2.5 text-sm text-white/50"
                      >
                        <CheckCircle2
                          className={`
                            w-4 h-4 mt-0.5 flex-shrink-0
                            ${
                              plan.popular ? 'text-indigo-400' : 'text-white/20'
                            }
                          `}
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.href} className="block">
                    <button
                      className={`
                        w-full inline-flex items-center justify-center
                        rounded-xl h-11
                        font-semibold text-sm
                        transition-all duration-300
                        ${
                          plan.popular
                            ? `
                            bg-white text-black
                            hover:bg-white/90
                            shadow-lg shadow-white/10
                          `
                            : `
                            bg-white/[0.04]
                            text-white/60
                            border border-white/[0.08]
                            hover:bg-white/[0.08]
                            hover:text-white
                            hover:border-white/[0.15]
                          `
                        }
                      `}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </Link>
                </div>

                {/* Bottom accent */}
                {plan.popular && (
                  <div
                    className="
                    h-1
                    bg-gradient-to-r from-indigo-500 to-purple-500
                    rounded-b-2xl
                  "
                  />
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Trust */}
        <AnimateIn delay={0.3}>
          <div
            className="
            mt-12 flex flex-col sm:flex-row
            items-center justify-center
            gap-6 sm:gap-8
          "
          >
            {[
              'No credit card required',
              '14-day free trial',
              'Cancel anytime',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm text-white/30"
              >
                <CheckCircle2 className="w-4 h-4 text-indigo-400/60" />
                {item}
              </div>
            ))}
          </div>
        </AnimateIn>
      </Container>
    </section>
  )
}
