'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Building2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterForm() {
  const router = useRouter()

  const [form, setForm] = useState({
    hospitalName: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (!form.hospitalName.trim()) {
      setError('Hospital name is required')
      return
    }

    setLoading(true)

    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          hospital_name: form.hospitalName,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  const textFields = [
    {
      id: 'hospitalName',
      label: 'Hospital / Clinic Name',
      type: 'text',
      placeholder: 'City General Hospital',
      icon: Building2,
      value: form.hospitalName,
    },
    {
      id: 'fullName',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Dr. John Smith',
      icon: User,
      value: form.fullName,
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'you@hospital.com',
      icon: Mail,
      value: form.email,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[420px]"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-2xl font-bold text-white tracking-tight mb-2"
        >
          Create your account
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-sm text-white/30"
        >
          Start your 14-day free trial
        </motion.p>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="
          bg-white/[0.03] border border-white/[0.06]
          rounded-2xl p-6 lg:p-8 backdrop-blur-sm
        "
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                flex items-center gap-2
                bg-red-500/10 border border-red-500/20
                rounded-xl px-4 py-3
              "
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Text fields */}
          {textFields.map((field, i) => {
            const Icon = field.icon
            return (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.25 + i * 0.05,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col gap-1.5"
              >
                <label
                  htmlFor={field.id}
                  className="text-xs font-medium text-white/40"
                >
                  {field.label}
                </label>
                <div className="relative">
                  <Icon
                    className="
                    absolute left-3.5 top-1/2 -translate-y-1/2
                    w-4 h-4 text-white/20
                  "
                  />
                  <input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => updateField(field.id, e.target.value)}
                    required
                    className="
                      w-full h-11
                      bg-white/[0.04] border border-white/[0.08]
                      rounded-xl pl-10 pr-4
                      text-sm text-white placeholder:text-white/20
                      focus:outline-none
                      focus:border-indigo-500/50
                      focus:ring-1 focus:ring-indigo-500/30
                      transition-all duration-200
                    "
                  />
                </div>
              </motion.div>
            )
          })}

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex flex-col gap-1.5"
          >
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
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={(e) => updateField('password', e.target.value)}
                required
                className="
                  w-full h-11
                  bg-white/[0.04] border border-white/[0.08]
                  rounded-xl pl-10 pr-11
                  text-sm text-white placeholder:text-white/20
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
          </motion.div>

          {/* Confirm Password */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="flex flex-col gap-1.5"
          >
            <label
              htmlFor="confirmPassword"
              className="text-xs font-medium text-white/40"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                className="
                absolute left-3.5 top-1/2 -translate-y-1/2
                w-4 h-4 text-white/20
              "
              />
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                required
                className={`
                  w-full h-11
                  bg-white/[0.04] rounded-xl
                  pl-10 pr-11
                  text-sm text-white placeholder:text-white/20
                  focus:outline-none transition-all duration-200
                  ${
                    error && error.includes('match')
                      ? 'border border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20'
                      : 'border border-white/[0.08] focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30'
                  }
                `}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="
                  absolute right-3.5 top-1/2 -translate-y-1/2
                  text-white/20 hover:text-white/50
                  transition-colors duration-200
                "
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </motion.div>

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
              rounded-xl font-semibold text-sm
              shadow-lg shadow-white/10
              flex items-center justify-center gap-2
              mt-2
            "
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Terms */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="
          text-center text-[11px] text-white/15
          mt-4 leading-relaxed
        "
      >
        By creating an account you agree to our{' '}
        <Link
          href="#"
          className="text-white/30 hover:text-white/50 transition-colors"
        >
          Terms
        </Link>{' '}
        and{' '}
        <Link
          href="#"
          className="text-white/30 hover:text-white/50 transition-colors"
        >
          Privacy Policy
        </Link>
      </motion.p>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="text-center text-sm text-white/20 mt-4"
      >
        Already have an account?{' '}
        <Link
          href="/login"
          className="
            text-indigo-400/70 hover:text-indigo-400
            font-medium transition-colors duration-200
          "
        >
          Sign in
          <ArrowRight className="w-3 h-3 inline ml-1" />
        </Link>
      </motion.p>
    </motion.div>
  )
}
