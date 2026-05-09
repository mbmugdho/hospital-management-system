import { createClient } from '@/lib/supabase/client'

// Fetch full profile row for the current user
export async function fetchProfile() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, hospital_name, email, phone, address')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}

// Update profile fields for the current user
export async function updateProfile(fields: {
  full_name?: string
  email?: string
  phone?: string
  address?: string
  hospital_name?: string
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('profiles')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  if (error) throw error
}

// Change password via Supabase auth
export async function changePassword(newPassword: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
}
