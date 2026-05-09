import SettingsPageClient from './SettingsPageClient'
import { createClient } from '@/lib/supabase/server'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, hospital_name, email, phone, address')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <SettingsPageClient
      userName={profile?.full_name ?? user?.email?.split('@')[0] ?? null}
      userEmail={profile?.email ?? user?.email ?? null}
      userPhone={profile?.phone ?? null}
      userAddress={profile?.address ?? null}
      hospitalName={profile?.hospital_name ?? null}
    />
  )
}
