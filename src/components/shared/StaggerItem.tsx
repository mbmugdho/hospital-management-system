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
          y: 25,
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.21, 0.47, 0.32, 0.98],
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
