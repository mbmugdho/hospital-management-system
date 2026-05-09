'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import Container from '@/components/shared/Container'
import AnimateIn from '@/components/shared/AnimateIn'

const faqs = [
  {
    q: 'Is MediCore free to use?',
    a: 'Yes. The Starter plan is completely free forever with up to 3 staff accounts, 100 patient records, and full access to appointments and billing. No credit card required to sign up.',
  },
  {
    q: 'How secure is my hospital data?',
    a: 'All data is encrypted at rest and in transit using AES-256. We use row-level security so each hospital account can only access its own data. We are SOC 2 Type II compliant and perform regular security audits.',
  },
  {
    q: 'Can I import my existing patient records?',
    a: 'Yes. MediCore supports CSV import for patients, staff, and appointment history. Our import wizard maps your existing column headers automatically and flags any errors before committing the data.',
  },
  {
    q: 'How many staff accounts can I create?',
    a: 'The Starter plan includes 3 staff accounts. The Professional plan includes 25 accounts and the Enterprise plan is unlimited. Each account can be assigned a role — Doctor, Nurse, Pharmacist, Receptionist, or Lab Technician.',
  },
  {
    q: 'Can multiple staff members use it at the same time?',
    a: 'Yes. MediCore is a real-time collaborative platform. All staff accounts on a plan can work simultaneously. Changes made by one user are reflected immediately across all sessions.',
  },
  {
    q: 'What happens to my data if I cancel my subscription?',
    a: 'You keep full access to export all your data at any time from the Settings page. After cancellation you have a 30-day grace period to download your records before they are permanently deleted.',
  },
  {
    q: 'Do you offer support?',
    a: 'Starter plan users have access to our documentation and community forum. Professional plan includes email support with a 24-hour response time. Enterprise plan includes dedicated support with a 2-hour SLA.',
  },
]

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  index: number
}

function FAQItem({ question, answer, isOpen, onToggle, index }: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 24,
        delay: index * 0.06,
      }}
      className={`border rounded-2xl overflow-hidden transition-colors duration-200
        ${
          isOpen
            ? 'bg-white/[0.04] border-white/[0.10]'
            : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.09]'
        }`}
    >
      {/* Question row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between
          px-6 py-5 text-left gap-4"
      >
        <span
          className={`text-sm font-medium leading-snug transition-colors duration-200
          ${isOpen ? 'text-white' : 'text-white/60'}`}
        >
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center
            justify-center transition-colors duration-200
            ${
              isOpen
                ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400'
                : 'bg-white/[0.04] border-white/[0.08] text-white/30'
            }`}
        >
          <Plus className="w-3 h-3" />
        </motion.div>
      </button>

      {/* Answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm text-white/35 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section id="faq" className="py-20 lg:py-28">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-12">
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
                Questions We Get
                <br className="hidden sm:block" />
                <span className="text-indigo-400">All The Time</span>
              </h2>
            </AnimateIn>
            <AnimateIn delay={0.2}>
              <p className="text-white/30 text-base leading-relaxed">
                Everything you need to know before getting started. Can not find
                your answer?{' '}
                <a
                  href="mailto:support@medicore.com"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Contact us.
                </a>
              </p>
            </AnimateIn>
          </div>

          {/* FAQ list */}
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <FAQItem
                key={faq.q}
                question={faq.q}
                answer={faq.a}
                isOpen={openIndex === index}
                onToggle={() => toggle(index)}
                index={index}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
