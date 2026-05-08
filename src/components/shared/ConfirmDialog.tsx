// Confirmation dialog for delete actions.
// Distinguishes between dummy (session) and real (permanent) deletions.

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Trash2 } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  isDummy?: boolean
  isLoading?: boolean
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isDummy = false,
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="w-full max-w-sm bg-[#0A0A0A] border border-white/[0.08] rounded-2xl shadow-2xl p-6"
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 mx-auto mb-4">
              {isDummy ? (
                <AlertTriangle size={22} className="text-amber-400" />
              ) : (
                <Trash2 size={22} className="text-red-400" />
              )}
            </div>

            {/* Content */}
            <h3 className="text-base font-semibold text-white text-center mb-2">
              {title}
            </h3>
            <p className="text-sm text-white/50 text-center mb-1">{message}</p>

            {/* Note for dummy vs real */}
            {isDummy ? (
              <p className="text-xs text-amber-400/70 text-center mb-6">
                This is sample data. It will restore on page refresh.
              </p>
            ) : (
              <p className="text-xs text-red-400/70 text-center mb-6">
                This action is permanent and cannot be undone.
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="
                  flex-1 px-4 py-2.5 rounded-xl text-sm font-medium
                  text-white/60 bg-white/[0.04] border border-white/[0.06]
                  hover:bg-white/[0.08] hover:text-white/80
                  transition-all duration-150 disabled:opacity-50
                "
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="
                  flex-1 px-4 py-2.5 rounded-xl text-sm font-medium
                  text-white bg-red-500/80 border border-red-500/40
                  hover:bg-red-500 transition-all duration-150
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {isLoading ? 'Deleting...' : isDummy ? 'Remove' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
