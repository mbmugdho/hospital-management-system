// All Supabase CRUD operations for invoices and invoice_items tables.

import { createClient } from '@/lib/supabase/client'

export interface InvoiceItemRow {
  id: string
  invoice_id: string
  description: string
  quantity: number
  price: number
}

export interface InvoiceRow {
  id: string
  user_id: string
  patient_id: string | null
  patient_name: string
  date: string
  subtotal: number
  tax: number
  total: number
  status: string
  notes: string
  items?: InvoiceItemRow[]
  created_at: string
  updated_at: string
}

export type InvoiceItemInsert = Omit<InvoiceItemRow, 'id'>

export type InvoiceInsert = Omit<
  InvoiceRow,
  'id' | 'user_id' | 'items' | 'created_at' | 'updated_at'
>

export type InvoiceUpdate = Partial<InvoiceInsert>

// Fetch all invoices with their line items
export async function fetchInvoices(): Promise<InvoiceRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('invoices')
    .select(`*, invoice_items(*)`)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as InvoiceRow[]
}

// Insert a new invoice with its line items
export async function insertInvoice(
  invoice: InvoiceInsert,
  items: Omit<InvoiceItemInsert, 'invoice_id'>[],
  userId: string
): Promise<InvoiceRow> {
  const supabase = createClient()

  const { data: inv, error: invError } = await supabase
    .from('invoices')
    .insert({ ...invoice, user_id: userId })
    .select()
    .single()

  if (invError) throw new Error(invError.message)

  if (items.length > 0) {
    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(items.map((item) => ({ ...item, invoice_id: inv.id })))

    if (itemsError) throw new Error(itemsError.message)
  }

  return inv as InvoiceRow
}

// Update an invoice and replace its items
export async function updateInvoice(
  id: string,
  updates: InvoiceUpdate,
  items?: Omit<InvoiceItemInsert, 'invoice_id'>[]
): Promise<InvoiceRow> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('invoices')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Replace all items if provided
  if (items) {
    await supabase.from('invoice_items').delete().eq('invoice_id', id)
    if (items.length > 0) {
      await supabase
        .from('invoice_items')
        .insert(items.map((item) => ({ ...item, invoice_id: id })))
    }
  }

  return data as InvoiceRow
}

// Delete an invoice permanently (items cascade delete)
export async function deleteInvoice(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('invoices').delete().eq('id', id)

  if (error) throw new Error(error.message)
}
