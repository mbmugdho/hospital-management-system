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
      .select('full_name, hospital_name')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <SettingsPageClient
      userName={profile?.full_name ?? user?.email?.split('@')[0] ?? null}
      userEmail={user?.email ?? null}
      hospitalName={profile?.hospital_name ?? null}
    />
  )
}
