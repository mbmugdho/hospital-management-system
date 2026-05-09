import type { Metadata } from 'next'
import { TooltipProvider } from '@/components/ui/tooltip'
import './globals.css'

export const metadata: Metadata = {
  title: 'MediCore — Hospital Management System',
  description: 'Modern Hospital Management System for clinics and hospitals',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}
