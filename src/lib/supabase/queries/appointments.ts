// All Supabase CRUD operations for the appointments table.

import { createClient } from '@/lib/supabase/client'

export interface AppointmentRow {
  id: string
  user_id: string
  patient_id: string | null
  doctor_id: string | null
  patient_name: string
  doctor_name: string
  date: string
  time: string
  type: string
  status: string
  notes: string
  created_at: string
  updated_at: string
}

export type AppointmentInsert = Omit<
  AppointmentRow,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>

export type AppointmentUpdate = Partial<AppointmentInsert>

// Fetch all appointments for the logged-in user
export async function fetchAppointments(): Promise<AppointmentRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  return data as AppointmentRow[]
}

// Insert a new appointment
export async function insertAppointment(
  appointment: AppointmentInsert,
  userId: string
): Promise<AppointmentRow> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('appointments')
    .insert({ ...appointment, user_id: userId })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as AppointmentRow
}

// Update an appointment
export async function updateAppointment(
  id: string,
  updates: AppointmentUpdate
): Promise<AppointmentRow> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as AppointmentRow
}

// Delete an appointment permanently
export async function deleteAppointment(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('appointments').delete().eq('id', id)

  if (error) throw new Error(error.message)
}
