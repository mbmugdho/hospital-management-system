// All Supabase CRUD operations for the doctors table.

import { createClient } from '@/lib/supabase/client'

export interface DoctorRow {
  id: string
  user_id: string
  name: string
  email: string
  phone: string
  specialization: string
  department: string
  role: string
  availability: string
  status: string
  joined_at: string
  created_at: string
  updated_at: string
}

export type DoctorInsert = Omit<
  DoctorRow,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>

export type DoctorUpdate = Partial<DoctorInsert>

// Fetch all staff for the logged-in user
export async function fetchDoctors(): Promise<DoctorRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as DoctorRow[]
}

// Insert a new staff member
export async function insertDoctor(
  doctor: DoctorInsert,
  userId: string
): Promise<DoctorRow> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('doctors')
    .insert({ ...doctor, user_id: userId })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as DoctorRow
}

// Update a staff member
export async function updateDoctor(
  id: string,
  updates: DoctorUpdate
): Promise<DoctorRow> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('doctors')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as DoctorRow
}

// Delete a staff member permanently
export async function deleteDoctor(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('doctors').delete().eq('id', id)

  if (error) throw new Error(error.message)
}
