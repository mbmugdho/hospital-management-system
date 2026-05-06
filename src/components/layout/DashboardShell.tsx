'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import DashboardNavbar from '@/components/layout/DashboardNavbar'
import { createClient } from '@/lib/supabase/client'

interface DashboardShellProps {
  children: React.ReactNode
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<{
    email?: string
    full_name?: string
    hospital_name?: string
  } | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (authUser) {
        // Get profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, hospital_name')
          .eq('id', authUser.id)
          .single()

        setUser({
          email: authUser.email,
          full_name:
            profile?.full_name || authUser.user_metadata?.full_name || '',
          hospital_name: profile?.hospital_name || '',
        })
      }
    }

    fetchUser()
  }, [])

  return (
    <div
      className="
      min-h-screen w-full
      bg-[#050505]
      flex
    "
    >
      {/* ── Sidebar ── */}
      <Sidebar
        user={user}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* ── Top Navbar ── */}
        <DashboardNavbar user={user} onMenuClick={() => setMobileOpen(true)} />

        {/* ── Page Content ── */}
        <main
          className="
          flex-1
          overflow-y-auto
          p-4 lg:p-6
        "
        >
          {children}
        </main>
      </div>
    </div>
  )
}
