'use client'

import { useRef, useEffect, useState } from 'react'
import { useInView } from 'framer-motion'

interface CountUpProps {
  target: string
  duration?: number
  className?: string
}

export default function CountUp({
  target,
  duration = 2,
  className = '',
}: CountUpProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!isInView) return

    // Extract number from string like "500+", "50,000+", "99.9%", "24/7"
    const hasPlus = target.includes('+')
    const hasPercent = target.includes('%')
    const hasSlash = target.includes('/')

    if (hasSlash) {
      // "24/7" — just show it directly
      setDisplay(target)
      return
    }

    // Remove non-numeric except dots
    const cleanNum = target.replace(/[^0-9.]/g, '')
    const finalNum = parseFloat(cleanNum)
    const isDecimal = cleanNum.includes('.')

    const startTime = performance.now()
    const durationMs = duration * 1000

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / durationMs, 1)

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * finalNum

      let formatted: string
      if (isDecimal) {
        formatted = current.toFixed(1)
      } else {
        const rounded = Math.floor(current)
        formatted = rounded.toLocaleString()
      }

      // Add suffix
      let suffix = ''
      if (hasPlus) suffix = '+'
      if (hasPercent) suffix = '%'

      setDisplay(formatted + suffix)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, target, duration])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
