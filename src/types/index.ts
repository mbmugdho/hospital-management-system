// src/types/index.ts

import type { LucideIcon } from "lucide-react";

/* ═══════════════════════════
   PATIENT
═══════════════════════════ */
export interface Patient {
  id:               string;
  name:             string;
  age:              number;
  gender:           "Male" | "Female" | "Other";
  bloodGroup:       string;
  phone:            string;
  email:            string;
  address:          string;
  emergencyContact: string;
  assignedDoctor:   string;
  status:           "Active" | "Inactive" | "Admitted";
  registeredAt:     string;
}

/* ═══════════════════════════
   DOCTOR
═══════════════════════════ */
export interface Doctor {
  id:             string;
  name:           string;
  email:          string;
  phone:          string;
  specialization: string;
  department:     string;
  role:           string;
  availability:   string[];
  status:         "Active" | "Inactive" | "On Leave";
  joinedAt:       string;
}

/* ═══════════════════════════
   APPOINTMENT
═══════════════════════════ */
export interface Appointment {
  id:        string;
  patientId: string;
  patient:   string;
  doctorId:  string;
  doctor:    string;
  date:      string;
  time:      string;
  type:      string;
  status:    "Pending" | "Confirmed" | "Completed" | "Cancelled";
  notes?:    string;
}

/* ═══════════════════════════
   BILLING
═══════════════════════════ */
export interface InvoiceItem {
  description: string;
  quantity:    number;
  price:       number;
}

export interface Invoice {
  id:        string;
  patientId: string;
  patient:   string;
  date:      string;
  items:     InvoiceItem[];
  subtotal:  number;
  tax:       number;
  total:     number;
  status:    "Paid" | "Unpaid" | "Partial";
  notes?:    string;
}

/* ═══════════════════════════
   PHARMACY
═══════════════════════════ */
export interface Medicine {
  id:          string;
  name:        string;
  category:    string;
  stock:       number;
  unit:        string;
  price:       number;
  expiryDate:  string;
  supplier:    string;
  stockStatus: "High" | "Medium" | "Low";
}

/* ═══════════════════════════
   NAV ITEM
═══════════════════════════ */
export interface NavItem {
  label: string;
  href:  string;
  icon:  LucideIcon;
}