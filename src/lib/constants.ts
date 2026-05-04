
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Stethoscope,
  Receipt,
  Pill,
  Settings,
} from "lucide-react";

export const APP_NAME    = "MediCore";
export const APP_TAGLINE = "Modern Hospital Management";

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    href:  "/dashboard",
    icon:  LayoutDashboard,
  },
  {
    label: "Patients",
    href:  "/patients",
    icon:  Users,
  },
  {
    label: "Appointments",
    href:  "/appointments",
    icon:  CalendarDays,
  },
  {
    label: "Doctors & Staff",
    href:  "/doctors",
    icon:  Stethoscope,
  },
  {
    label: "Billing",
    href:  "/billing",
    icon:  Receipt,
  },
  {
    label: "Pharmacy",
    href:  "/pharmacy",
    icon:  Pill,
  },
  {
    label: "Settings",
    href:  "/settings",
    icon:  Settings,
  },
] as const;

export const DEPARTMENTS = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "Radiology",
  "Emergency",
  "General Medicine",
  "Surgery",
  "Gynecology",
] as const;

export const BLOOD_GROUPS = [
  "A+", "A−",
  "B+", "B−",
  "O+", "O−",
  "AB+", "AB−",
] as const;

export const GENDERS = [
  "Male",
  "Female",
  "Other",
] as const;

export const APPOINTMENT_STATUSES = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
] as const;

export const PAYMENT_STATUSES = [
  "Paid",
  "Unpaid",
  "Partial",
] as const;

export const STOCK_STATUSES = [
  "High",
  "Medium",
  "Low",
] as const;

export const STAFF_ROLES = [
  "Doctor",
  "Nurse",
  "Receptionist",
  "Pharmacist",
  "Lab Technician",
  "Admin",
] as const;