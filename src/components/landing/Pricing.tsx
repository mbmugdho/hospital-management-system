import Link from 'next/link'
import Container from '@/components/shared/Container'
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    desc: 'Perfect for small clinics and independent practices.',
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
    desc: 'Ideal for growing hospitals and multi-department clinics.',
    price: '$79',
    period: '/month',
    popular: true,
    features: [
      'Unlimited patients',
      'Advanced scheduling & calendar',
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
    desc: 'For large hospital networks with complex requirements.',
    price: 'Custom',
    period: '',
    popular: false,
    features: [
      'Everything in Professional',
      'Unlimited staff accounts',
      'Custom integrations & API',
      'Dedicated account manager',
      'SLA guarantee',
      'On-premise deployment option',
    ],
    cta: 'Contact Sales',
    href: '/register',
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-28 bg-white">
      <Container>
        {/* ── Section Header — Split Layout ── */}
        <div
          className="
          flex flex-col lg:flex-row
          lg:items-end lg:justify-between
          gap-4 lg:gap-12
          mb-14 lg:mb-16
        "
        >
          {/* Left side */}
          <div className="max-w-xl">
            <span
              className="
              inline-flex items-center gap-2
              px-4 py-1.5
              rounded-full
              bg-blue-50 border border-blue-100
              text-[#3B82F6] text-xs font-semibold
              tracking-wide uppercase
              mb-4
            "
            >
              Pricing
            </span>

            <h2
              className="
              text-3xl lg:text-4xl
              font-bold text-[#0F172A]
              tracking-tight
              leading-tight
            "
            >
              Simple, Transparent
              <br className="hidden sm:block" />
              Pricing for Everyone
            </h2>
          </div>

          {/* Right side */}
          <p
            className="
            text-[#64748B] text-base lg:text-lg
            leading-relaxed
            max-w-md
            lg:text-right
          "
          >
            Choose the plan that fits your hospital. No hidden fees. No
            surprises. Cancel anytime.
          </p>
        </div>

        {/* ── Plans Grid ── */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`
                relative
                rounded-2xl
                border
                flex flex-col
                transition-all duration-300
                ${
                  plan.popular
                    ? `
                    border-[#3B82F6]
                    bg-white
                    shadow-2xl shadow-blue-100
                    ring-1 ring-[#3B82F6]/20
                    scale-[1.02]
                    z-10
                  `
                    : `
                    border-[#E2E8F0]
                    bg-white
                    hover:shadow-lg hover:shadow-slate-100
                    hover:border-[#CBD5E1]
                  `
                }
              `}
            >
              {/* ── Popular Badge ── */}
              {plan.popular && (
                <div
                  className="
                  absolute -top-3.5 left-1/2 -translate-x-1/2
                "
                >
                  <span
                    className="
                    inline-flex items-center gap-1.5
                    bg-gradient-to-r from-[#3B82F6] to-[#2563EB]
                    text-white
                    px-4 py-1.5
                    rounded-full
                    text-xs font-bold
                    shadow-md shadow-blue-200
                    tracking-wide
                  "
                  >
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              {/* ── Card Content ── */}
              <div className="p-7 lg:p-8 flex flex-col flex-1">
                {/* Plan Name & Description */}
                <div className="mb-6">
                  <h3
                    className="
                    text-lg font-bold
                    text-[#0F172A]
                    mb-1.5
                  "
                  >
                    {plan.name}
                  </h3>
                  <p
                    className="
                    text-sm text-[#64748B]
                    leading-relaxed
                  "
                  >
                    {plan.desc}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-end gap-1.5 mb-6">
                  <span
                    className="
                    text-4xl lg:text-5xl
                    font-bold text-[#0F172A]
                    tracking-tight
                    leading-none
                  "
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className="
                      text-[#64748B]
                      text-sm font-medium
                      mb-1.5
                    "
                    >
                      {plan.period}
                    </span>
                  )}
                </div>

                {/* Divider */}
                <div
                  className={`
                  border-t mb-6
                  ${plan.popular ? 'border-blue-100' : 'border-[#E2E8F0]'}
                `}
                />

                {/* Features List */}
                <ul className="flex flex-col gap-3.5 mb-8 flex-1">
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="
                        flex items-start gap-3
                        text-sm text-[#0F172A]
                      "
                    >
                      <CheckCircle2
                        className={`
                          w-4.5 h-4.5
                          mt-0.5 flex-shrink-0
                          ${plan.popular ? 'text-[#3B82F6]' : 'text-[#10B981]'}
                        `}
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link href={plan.href} className="block">
                  <button
                    className={`
                      w-full
                      inline-flex items-center justify-center
                      rounded-xl h-12
                      font-semibold text-sm
                      transition-all duration-300
                      hover:-translate-y-0.5
                      ${
                        plan.popular
                          ? `
                          bg-gradient-to-r from-[#3B82F6] to-[#2563EB]
                          hover:from-[#2563EB] hover:to-[#1D4ED8]
                          text-white
                          shadow-lg shadow-blue-200
                          hover:shadow-xl hover:shadow-blue-200
                        `
                          : `
                          bg-[#F8FAFC]
                          hover:bg-[#F1F5F9]
                          text-[#0F172A]
                          border border-[#E2E8F0]
                          hover:border-[#CBD5E1]
                          shadow-sm
                        `
                      }
                    `}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </Link>
              </div>

              {/* ── Bottom Accent Bar (popular only) ── */}
              {plan.popular && (
                <div
                  className="
                  h-1.5
                  bg-gradient-to-r from-[#3B82F6] to-[#2563EB]
                  rounded-b-2xl
                "
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Bottom Trust Line ── */}
        <div
          className="
          mt-12 lg:mt-14
          flex flex-col sm:flex-row
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
              className="
                flex items-center gap-2
                text-sm text-[#64748B]
              "
            >
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              {item}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
