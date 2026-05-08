// All Supabase CRUD operations for the medicines table.

import { createClient } from '@/lib/supabase/client'

export interface MedicineRow {
  id: string
  user_id: string
  name: string
  category: string
  stock: number
  unit: string
  price: number
  expiry_date: string
  supplier: string
  stock_status: string
  created_at: string
  updated_at: string
}

export type MedicineInsert = Omit<
  MedicineRow,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>

export type MedicineUpdate = Partial<MedicineInsert>

// Fetch all medicines for the logged-in user
export async function fetchMedicines(): Promise<MedicineRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as MedicineRow[]
}

// Insert a new medicine
export async function insertMedicine(
  medicine: MedicineInsert,
  userId: string
): Promise<MedicineRow> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('medicines')
    .insert({ ...medicine, user_id: userId })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as MedicineRow
}

// Update a medicine
export async function updateMedicine(
  id: string,
  updates: MedicineUpdate
): Promise<MedicineRow> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('medicines')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as MedicineRow
}

// Delete a medicine permanently
export async function deleteMedicine(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('medicines').delete().eq('id', id)

  if (error) throw new Error(error.message)
}
