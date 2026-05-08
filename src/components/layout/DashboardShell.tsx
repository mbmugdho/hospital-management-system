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
    <div className="h-screen w-full bg-[#050505] flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        user={user}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Right column — min-w-0 prevents flex overflow cutting the right side */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        {/* Navbar */}
        <DashboardNavbar user={user} onMenuClick={() => setMobileOpen(true)} />

        {/* Scrollable content — min-w-0 keeps it inside the column */}
        <main className="flex-1 overflow-y-auto min-h-0 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
