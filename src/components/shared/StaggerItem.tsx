'use client'

import { motion } from 'framer-motion'

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
}

export default function StaggerItem({
  children,
  className = '',
}: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: {
          opacity: 0,
          y: 20,
          filter: 'blur(6px)',
        },
        visible: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
