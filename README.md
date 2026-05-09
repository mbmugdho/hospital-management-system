# MediCore Hospital Management System

A modern, full-featured hospital management system built with Next.js, Supabase, and Tailwind CSS. Designed for clinics and hospitals to manage patients, appointments, billing, and pharmacy inventory in one integrated platform.

## 🚀 Live Demo

👉 [View Live Demo](https://medicore-org.vercel.app/) <!-- Update with your deployed URL -->

## ✨ Features

### **Patient Management**

- Complete patient records with medical history
- Status tracking (Active/Admitted/Inactive)
- Emergency contact management
- CSV import/export

### **Appointment Scheduling**

- Calendar view with drag-and-drop
- Appointment types (Consultation, Follow-up, Emergency)
- Status tracking (Confirmed/Pending/Completed)
- Automated reminders

### **Staff & Doctor Management**

- Role-based access (Doctor, Nurse, Pharmacist, etc.)
- Department organization
- Availability tracking
- Specialization management

### **Billing & Invoices**

- Invoice generation with line items
- Payment status tracking (Paid/Unpaid/Partial)
- Tax calculations
- PDF export for accounting

### **Pharmacy & Inventory**

- Medicine stock tracking
- Low stock alerts
- Expiry date monitoring
- Category management

### **Analytics Dashboard**

- Revenue overview charts
- Appointment statistics
- Patient demographics
- Exportable reports

### **Admin & Settings**

- Profile management
- Hospital information
- Security settings
- Data export/privacy controls

## 🛠 Tech Stack

| Category       | Technologies                                  |
| -------------- | --------------------------------------------- |
| **Framework**  | Next.js 16 (App Router), React 19, TypeScript |
| **Database**   | Supabase (PostgreSQL), Row-Level Security     |
| **Auth**       | Supabase Auth (Email/Password)                |
| **UI**         | Tailwind CSS v4, Framer Motion, Lucide Icons  |
| **Charts**     | Recharts                                      |
| **Forms**      | Custom React hooks + Supabase integration     |
| **Export**     | CSV + PDF generation                          |
| **Deployment** | Vercel (recommended) or any Node.js hosting   |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase account (free tier)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/medicore.git
   cd medicore
   ```

   2.Install dependencies:
   npm install

# or

yarn install

# or

pnpm install
3.Set up environment variables:
cp .env.example .env.local
4.Run the development server:
npm run dev
5.Open http://localhost:3000 in your browser

🛠 Supabase Setup
1.Create a new project in Supabase
2.Run these SQL commands in the SQL Editor to create your tables:
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
full_name TEXT,
hospital_name TEXT,
email TEXT,
phone TEXT,
address TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients table
CREATE TABLE patients (
id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
name TEXT NOT NULL,
age INTEGER,
gender TEXT,
blood_group TEXT,
phone TEXT,
email TEXT,
address TEXT,
emergency_contact TEXT,
assigned_doctor TEXT,
status TEXT,
registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON profiles
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Enable insert for all users" ON profiles
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Enable update for profile owners" ON profiles
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Enable delete for profile owners" ON profiles
FOR DELETE USING (user_id = auth.uid());

-- Repeat similar policies for all other tables...
3.Set up Row Level Security (RLS) policies for all tables
4.Configure Auth providers in Supabase dashboard

📦 Project Structure
src/
├── app/ # Next.js app router
│ ├── (auth)/ # Auth pages
│ ├── (dashboard)/ # Protected routes
│ └── (public)/ # Public routes
├── components/ # Reusable components
│ ├── dashboard/ # Dashboard-specific
│ ├── landing/ # Landing page sections
│ ├── layout/ # Layout wrappers
│ └── shared/ # Shared UI
├── data/ # Sample data
├── lib/ # Utilities
│ ├── supabase/ # Supabase client
│ └── utils/ # Helper functions
├── types/ # TypeScript types
└── styles/ # Global styles

🎨 Design System
Element Style
Colors Primary: Indigo (#6366F1), Background: #050505
Typography Font: Inter, Sizes: 12px-48px
Spacing Unit: 8px (rem), Container: max-w-[1440px]
Borders 1px border-white/[0.06], Radius: rounded-xl/rounded-2xl
Cards bg-white/[0.02], border border-white/[0.06]
Animations Framer Motion spring physics (stiffness: 260, damping: 24)

🔧 Configuration
Update these files for your deployment:
1.src/app/layout.tsx - Site metadata
2.src/components/landing/CtaBanner.tsx - Call-to-action links
3.src/lib/supabase/client.ts - Supabase configuration
4.next.config.js - Domain configuration

🚀 Deployment
Vercel (Recommended)
1.Push to GitHub/GitLab/Bitbucket
2.Import project to Vercel
3.Add environment variables
4.Deploy
Other Platforms
Works with any Node.js hosting:
Netlify
Render
Railway
AWS
DigitalOcean

🤝 Contributing
Contributions are welcome! Please follow these steps:

1.Fork the project
2.Create your feature branch (git checkout -b feature/AmazingFeature)
3.Commit your changes (git commit -m 'Add some AmazingFeature')
4.Push to the branch (git push origin feature/AmazingFeature)
5.Open a Pull Request

📄 License
This project is licensed under the MIT License.
© 2026 MediCore. All rights reserved.
