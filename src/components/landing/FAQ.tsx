'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import Container from '@/components/shared/Container'
import AnimateIn from '@/components/shared/AnimateIn'

const faqs = [
  {
    q: 'Is MediCore free to use?',
    a: 'Yes. The Starter plan is completely free forever — 3 staff accounts, 100 patient records, and full access to appointments, billing, and pharmacy. No credit card required.',
  },
  {
    q: 'How secure is my hospital data?',
    a: 'All data is encrypted at rest and in transit with AES-256. Row-level security ensures each hospital can only access its own records. We run regular security audits and penetration tests.',
  },
  {
    q: 'Can I import existing patient records?',
    a: 'Yes. MediCore supports CSV import for patients, staff, and appointment history. The import wizard auto-maps your column headers and flags any issues before committing.',
  },
  {
    q: 'How many staff accounts can I create?',
    a: 'Starter includes 3, Professional includes 25, Enterprise is unlimited. Each account gets a role — Doctor, Nurse, Pharmacist, Receptionist, or Lab Technician — with appropriate permissions.',
  },
  {
    q: 'Can multiple staff work simultaneously?',
    a: 'Yes. MediCore is a real-time collaborative platform. All staff on a plan can work at the same time. Changes reflect instantly across all sessions.',
  },
  {
    q: 'What happens if I cancel my plan?',
    a: 'You keep full access to export your data anytime from Settings. After cancellation you have 30 days to download records before permanent deletion. The Starter plan never expires.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-4 lg:py-6">
      <Container>
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20">
          {/* Left — header (stays sticky on desktop) */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <AnimateIn>
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5
                rounded-full bg-white/[0.04] border border-white/[0.06]
                text-indigo-400 text-xs font-semibold tracking-wide
                uppercase mb-4"
              >
                FAQ
              </span>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <h2
                className="text-3xl lg:text-4xl font-bold text-white
                tracking-tight leading-tight mb-4"
              >
                Common
                <br />
                questions
              </h2>
            </AnimateIn>
            <AnimateIn delay={0.2}>
              <p className="text-white/30 text-base leading-relaxed mb-6">
                Everything you need to know before getting started with
                MediCore.
              </p>
              <p className="text-white/20 text-sm">
                Still have questions?{' '}
                <a
                  href="mailto:support@medicore.com"
                  className="text-indigo-400 hover:text-indigo-300
                  transition-colors underline underline-offset-4
                  decoration-indigo-400/30"
                >
                  Reach out to us
                </a>
              </p>
            </AnimateIn>
          </div>

          {/* Right — accordion */}
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <AnimateIn key={faq.q} delay={0.05 + index * 0.05}>
                  <div
                    className={`border rounded-2xl overflow-hidden
                    transition-all duration-200
                    ${
                      isOpen
                        ? 'bg-white/[0.04] border-white/[0.10]'
                        : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.09]'
                    }`}
                  >
                    {/* Question */}
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between
                        px-6 py-5 text-left gap-4"
                    >
                      <span
                        className={`text-sm font-medium leading-snug
                        transition-colors duration-200
                        ${isOpen ? 'text-white' : 'text-white/60'}`}
                      >
                        {faq.q}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 25,
                        }}
                        className={`flex-shrink-0 w-7 h-7 rounded-full
                        border flex items-center justify-center
                        transition-colors duration-200
                        ${
                          isOpen
                            ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400'
                            : 'bg-white/[0.04] border-white/[0.08] text-white/30'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </motion.div>
                    </button>

                    {/* Answer */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                          }}
                          className="overflow-hidden"
                        >
                          <p
                            className="px-6 pb-5 text-sm text-white/35
                            leading-relaxed"
                          >
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
