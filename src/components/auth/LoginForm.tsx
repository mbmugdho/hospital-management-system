'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate login — replace with real auth later
    setTimeout(() => {
      setLoading(false)
      window.location.href = '/dashboard'
    }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[420px]"
    >
      {/* ── Header ── */}
      <div className="text-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="
            text-2xl font-bold text-white
            tracking-tight mb-2
          "
        >
          Welcome back
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-sm text-white/30"
        >
          Sign in to your MediCore account
        </motion.p>
      </div>

      {/* ── Form Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="
          bg-white/[0.03]
          border border-white/[0.06]
          rounded-2xl
          p-6 lg:p-8
          backdrop-blur-sm
        "
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium text-white/40"
            >
              Email address
            </label>
            <div className="relative">
              <Mail
                className="
                absolute left-3.5 top-1/2 -translate-y-1/2
                w-4 h-4 text-white/20
              "
              />
              <input
                id="email"
                type="email"
                placeholder="you@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="
                  w-full h-11
                  bg-white/[0.04]
                  border border-white/[0.08]
                  rounded-xl
                  pl-10 pr-4
                  text-sm text-white
                  placeholder:text-white/20
                  focus:outline-none
                  focus:border-indigo-500/50
                  focus:ring-1 focus:ring-indigo-500/30
                  transition-all duration-200
                "
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-medium text-white/40"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className="
                absolute left-3.5 top-1/2 -translate-y-1/2
                w-4 h-4 text-white/20
              "
              />
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="
                  w-full h-11
                  bg-white/[0.04]
                  border border-white/[0.08]
                  rounded-xl
                  pl-10 pr-11
                  text-sm text-white
                  placeholder:text-white/20
                  focus:outline-none
                  focus:border-indigo-500/50
                  focus:ring-1 focus:ring-indigo-500/30
                  transition-all duration-200
                "
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="
                  absolute right-3.5 top-1/2 -translate-y-1/2
                  text-white/20 hover:text-white/50
                  transition-colors duration-200
                "
              >
                {showPass ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div
                onClick={() => setRemember(!remember)}
                className={`
                  w-4 h-4 rounded
                  border transition-all duration-200
                  flex items-center justify-center
                  ${
                    remember
                      ? 'bg-indigo-500 border-indigo-500'
                      : 'bg-white/[0.04] border-white/[0.12] group-hover:border-white/[0.2]'
                  }
                `}
              >
                {remember && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="w-3 h-3 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12l5 5L20 7" />
                  </motion.svg>
                )}
              </div>
              <span className="text-xs text-white/30 group-hover:text-white/50 transition-colors">
                Remember me
              </span>
            </label>

            <Link
              href="#"
              className="
                text-xs text-indigo-400/70
                hover:text-indigo-400
                transition-colors duration-200
              "
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={loading ? {} : { scale: 1.02 }}
            whileTap={loading ? {} : { scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="
              w-full h-11
              bg-white text-black
              hover:bg-white/90
              disabled:opacity-60 disabled:cursor-not-allowed
              rounded-xl
              font-semibold text-sm
              shadow-lg shadow-white/10
              flex items-center justify-center gap-2
              mt-1
            "
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* ── Footer ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="
          text-center text-sm text-white/20
          mt-6
        "
      >
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="
            text-indigo-400/70
            hover:text-indigo-400
            font-medium
            transition-colors duration-200
          "
        >
          Create one
          <ArrowRight className="w-3 h-3 inline ml-1" />
        </Link>
      </motion.p>
    </motion.div>
  )
}
