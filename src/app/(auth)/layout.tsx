import Link from 'next/link'
import { HeartPulse } from 'lucide-react'
import { APP_NAME } from '@/lib/constants'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full relative bg-black">
      {/* ── Global Background ── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.2), transparent 70%), #000000',
        }}
      />

      {/* ── Subtle Grid ── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* ── Back to Home ── */}
        <div className="p-6">
          <Link
            href="/"
            className="
              inline-flex items-center gap-2.5
              text-white/40
              hover:text-white
              transition-colors duration-200
              group
            "
          >
            <div
              className="
              w-8 h-8 rounded-lg
              bg-gradient-to-br from-indigo-500 to-purple-500
              flex items-center justify-center
              shadow-md shadow-indigo-500/20
              group-hover:shadow-lg group-hover:shadow-indigo-500/30
              transition-shadow duration-300
            "
            >
              <HeartPulse className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight">{APP_NAME}</span>
          </Link>
        </div>

        {/* ── Center Content ── */}
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          {children}
        </div>
      </div>
    </div>
  )
}
