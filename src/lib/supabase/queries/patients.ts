// All Supabase CRUD operations for the patients table.
// user_id is auto-scoped by RLS — no need to filter manually in SELECT.
// We still pass user_id explicitly on INSERT for clarity.

import { createClient } from '@/lib/supabase/client'

export interface PatientRow {
  id: string
  user_id: string
  name: string
  age: number
  gender: string
  blood_group: string
  phone: string
  email: string
  address: string
  emergency_contact: string
  assigned_doctor: string
  status: string
  registered_at: string
  created_at: string
  updated_at: string
}

export type PatientInsert = Omit<
  PatientRow,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>

export type PatientUpdate = Partial<PatientInsert>

// Fetch all patients for the logged-in user
export async function fetchPatients(): Promise<PatientRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as PatientRow[]
}

// Insert a new patient
export async function insertPatient(
  patient: PatientInsert,
  userId: string
): Promise<PatientRow> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('patients')
    .insert({ ...patient, user_id: userId })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as PatientRow
}

// Update an existing patient
export async function updatePatient(
  id: string,
  updates: PatientUpdate
): Promise<PatientRow> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('patients')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as PatientRow
}

// Delete a patient permanently
export async function deletePatient(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('patients').delete().eq('id', id)

  if (error) throw new Error(error.message)
}
