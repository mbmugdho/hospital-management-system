import { createClient } from '@/lib/supabase/server'
import WelcomeHeader from '@/components/dashboard/WelcomeHeader'
import StatCards from '@/components/dashboard/StatCards'
import RevenueChart from '@/components/dashboard/RevenueChart'
import TodayAppointments from '@/components/dashboard/TodayAppointments'
import RecentPatients from '@/components/dashboard/RecentPatients'
import QuickStats from '@/components/dashboard/QuickStats'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch profile from Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, hospital_name')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto">
        {/* Welcome Header */}
        <WelcomeHeader
          userName={profile?.full_name ?? user?.email?.split('@')[0]}
          hospitalName={profile?.hospital_name}
        />

        {/* Stat Cards */}
        <StatCards />

        {/* Main grid: chart + quick stats */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
          <RevenueChart />
          <QuickStats />
        </div>

        {/* Bottom grid: appointments + patients */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <TodayAppointments />
          <RecentPatients />
        </div>
      </div>
    </div>
  )
}
