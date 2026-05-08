'use client'

import { useState, useEffect, useCallback } from 'react'
import WelcomeHeader from '@/components/dashboard/WelcomeHeader'
import StatCards from '@/components/dashboard/StatCards'
import RevenueChart from '@/components/dashboard/RevenueChart'
import TodayAppointments from '@/components/dashboard/TodayAppointments'
import RecentPatients from '@/components/dashboard/RecentPatients'
import QuickStats from '@/components/dashboard/QuickStats'
import TableSkeleton from '@/components/shared/TableSkeleton'
import SampleBanner from '@/components/shared/SampleBanner'

import { patients as dummyPatients } from '@/data/patients'
import { appointments as dummyAppointments } from '@/data/appointments'
import { invoices as dummyInvoices } from '@/data/billing'
import { medicines as dummyMedicines } from '@/data/pharmacy'

import { mergeData, tagDummy } from '@/lib/utils/mergeData'
import type { WithMeta } from '@/lib/utils/mergeData'

import { fetchPatients } from '@/lib/supabase/queries/patients'
import { fetchAppointments } from '@/lib/supabase/queries/appointments'
import { fetchInvoices } from '@/lib/supabase/queries/billing'
import { fetchMedicines } from '@/lib/supabase/queries/pharmacy'
import { createClient } from '@/lib/supabase/client'

import type { Patient } from '@/types'
import type { Appointment } from '@/types'
import type { Invoice } from '@/types'
import type { Medicine } from '@/types'

export default function DashboardPage() {
  const [userName, setUserName] = useState<string | null>(null)
  const [hospitalName, setHospitalName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [allPatients, setAllPatients] = useState<WithMeta<Patient>[]>([])
  const [allAppointments, setAllAppointments] = useState<
    WithMeta<Appointment>[]
  >([])
  const [allInvoices, setAllInvoices] = useState<WithMeta<Invoice>[]>([])
  const [allMedicines, setAllMedicines] = useState<WithMeta<Medicine>[]>([])

  const loadAll = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, hospital_name')
          .eq('id', user.id)
          .single()

        setUserName(profile?.full_name ?? user.email?.split('@')[0] ?? null)
        setHospitalName(profile?.hospital_name ?? null)
      }

      // Fetch all real data in parallel
      const [realPatients, realAppointments, realInvoices, realMedicines] =
        await Promise.allSettled([
          fetchPatients(),
          fetchAppointments(),
          fetchInvoices(),
          fetchMedicines(),
        ])

      // Map and merge patients
      const mappedPatients: Patient[] =
        realPatients.status === 'fulfilled'
          ? realPatients.value.map((r) => ({
              id: r.id,
              name: r.name,
              age: r.age,
              gender: r.gender,
              bloodGroup: r.blood_group,
              phone: r.phone,
              email: r.email,
              address: r.address,
              emergencyContact: r.emergency_contact,
              assignedDoctor: r.assigned_doctor,
              status: r.status as Patient['status'],
              registeredAt: r.registered_at,
            }))
          : []
      setAllPatients(mergeData(dummyPatients, mappedPatients))

      // Map and merge appointments
      const mappedAppointments: Appointment[] =
        realAppointments.status === 'fulfilled'
          ? realAppointments.value.map((r) => ({
              id: r.id,
              patientId: r.patient_id ?? '',
              patient: r.patient_name,
              doctorId: r.doctor_id ?? '',
              doctor: r.doctor_name,
              date: r.date,
              time: r.time,
              type: r.type,
              status: r.status as Appointment['status'],
              notes: r.notes,
            }))
          : []
      setAllAppointments(mergeData(dummyAppointments, mappedAppointments))

      // Map and merge invoices
      const mappedInvoices: Invoice[] =
        realInvoices.status === 'fulfilled'
          ? realInvoices.value.map((r) => ({
              id: r.id,
              patientId: r.patient_id ?? '',
              patient: r.patient_name,
              date: r.date,
              items: (r.items ?? []).map((it) => ({
                description: it.description,
                quantity: it.quantity,
                price: it.price,
              })),
              subtotal: r.subtotal,
              tax: r.tax,
              total: r.total,
              status: r.status as Invoice['status'],
              notes: r.notes,
            }))
          : []
      setAllInvoices(mergeData(dummyInvoices, mappedInvoices))

      // Map and merge medicines
      const mappedMedicines: Medicine[] =
        realMedicines.status === 'fulfilled'
          ? realMedicines.value.map((r) => ({
              id: r.id,
              name: r.name,
              category: r.category,
              stock: r.stock,
              unit: r.unit,
              price: r.price,
              expiryDate: r.expiry_date,
              supplier: r.supplier,
              stockStatus: r.stock_status as Medicine['stockStatus'],
            }))
          : []
      setAllMedicines(mergeData(dummyMedicines, mappedMedicines))
    } catch {
      // On total failure fall back to dummy data so dashboard never breaks
      setAllPatients(tagDummy(dummyPatients))
      setAllAppointments(tagDummy(dummyAppointments))
      setAllInvoices(tagDummy(dummyInvoices))
      setAllMedicines(tagDummy(dummyMedicines))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  // Compute stat card values from merged data
  const totalRevenue = allInvoices.reduce((s, inv) => s + inv.total, 0)
  const totalExpenses = Math.round(totalRevenue * 0.64)
  const netProfit = totalRevenue - totalExpenses

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto">
        {/* Welcome Header with export wired to all merged data */}
        <WelcomeHeader
          userName={userName}
          hospitalName={hospitalName}
          patients={allPatients}
          appointments={allAppointments}
          invoices={allInvoices}
          medicines={allMedicines}
        />

        {/* Stat Cards — loading skeleton or live counts */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/[0.02] border border-white/[0.06]
                  rounded-2xl p-6 space-y-4 animate-pulse"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05]" />
                  <div className="w-14 h-6 rounded-full bg-white/[0.05]" />
                </div>
                <div className="space-y-2">
                  <div className="h-8 w-24 bg-white/[0.06] rounded-lg" />
                  <div className="h-3 w-32 bg-white/[0.04] rounded-full" />
                  <div className="h-3 w-20 bg-white/[0.03] rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <StatCards
            totalPatients={allPatients.length}
            appointmentsToday={allAppointments.length}
            totalRevenue={totalRevenue}
            newRegistrations={allPatients.length}
          />
        )}

        {/* Revenue chart + quick stats */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
          {loading ? (
            <div
              className="bg-white/[0.02] border border-white/[0.06]
              rounded-2xl p-6 h-80 animate-pulse"
            />
          ) : (
            <RevenueChart
              totalRevenue={totalRevenue}
              totalExpenses={totalExpenses}
              netProfit={netProfit}
            />
          )}
          <QuickStats />
        </div>

        {/* Today appointments + recent patients */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {loading ? (
            <>
              <TableSkeleton rows={6} cols={4} />
              <TableSkeleton rows={6} cols={4} />
            </>
          ) : (
            <>
              <TodayAppointments appointments={allAppointments} />
              <RecentPatients patients={allPatients} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
