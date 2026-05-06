'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface AnimateInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
  once?: boolean
  blur?: boolean
}

export default function AnimateIn({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.6,
  once = true,
  blur = true,
}: AnimateInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-60px' })

  const directionOffset = {
    up: { y: 24, x: 0 },
    down: { y: -24, x: 0 },
    left: { x: 24, y: 0 },
    right: { x: -24, y: 0 },
    none: { x: 0, y: 0 },
  }

  const offset = directionOffset[direction]

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        y: offset.y,
        x: offset.x,
        filter: blur ? 'blur(8px)' : 'blur(0px)',
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
              x: 0,
              filter: 'blur(0px)',
            }
          : {
              opacity: 0,
              y: offset.y,
              x: offset.x,
              filter: blur ? 'blur(8px)' : 'blur(0px)',
            }
      }
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // expo out — feels snappy and premium
      }}
    >
      {children}
    </motion.div>
  )
}
