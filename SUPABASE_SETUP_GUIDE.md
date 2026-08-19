# 🚀 Simple Supabase Setup Guide for AuraMed AI (MVP / Prototype)

This is a step-by-step guide to set up your free Supabase database and connect it to your 4-page medical AI prototype in **under 5 minutes**.

---

## Step 1: Create a Free Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in (or create a free account with GitHub/Google).
2. Click **"New project"**.
3. Fill in:
   - **Name**: `auramed-ai` (or any name you prefer)
   - **Database Password**: Set a secure password.
   - **Region**: Select a region close to you.
   - **Pricing Plan**: Select **Free tier**.
4. Click **"Create new project"** and wait ~1 minute for it to finish provisioning.

---

## Step 2: Create Your Tables (1-Click SQL Script)

1. In your Supabase project dashboard, click on the **"SQL Editor"** tab on the left sidebar (icon with `>_`).
2. Click **"New query"**.
3. Copy the entire SQL script below, paste it into the editor, and click **"Run"**:

```sql
-- ============================================================================
-- AuraMed AI Prototype Database Tables (with Maternal Health Context)
-- ============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Patients Table (Demographics, Vitals, Maternal Status, Conditions & Allergies)
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female')),
    blood_type TEXT,
    height_cm NUMERIC(5,2),
    weight_kg NUMERIC(5,2),
    is_pregnant BOOLEAN DEFAULT FALSE,
    pregnancy_weeks INTEGER,
    pregnancy_trimester TEXT,
    chronic_conditions TEXT[] DEFAULT '{}',
    allergies TEXT[] DEFAULT '{}',
    medical_history TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Patient Medicines Table (Active Medication Chips)
CREATE TABLE IF NOT EXISTS public.patient_medicines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    dosage TEXT,
    frequency TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Messages Table (Chat History)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    sender TEXT CHECK (sender IN ('user', 'assistant')) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Row Level Security Policies (Permissive for Fast Prototype Testing)
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to patients" 
ON public.patients FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to medicines" 
ON public.patient_medicines FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to messages" 
ON public.messages FOR ALL TO public USING (true) WITH CHECK (true);

-- 6. Auto-Confirm Trigger for Prototype Sign-ups
CREATE OR REPLACE FUNCTION public.auto_confirm_prototype_user()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email_confirmed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_auto_confirm ON auth.users;
CREATE TRIGGER on_auth_user_created_auto_confirm
BEFORE INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.auto_confirm_prototype_user();
```

---

## Step 3: Get Your API Keys

1. In your Supabase dashboard, click the **"Project Settings"** gear icon (bottom of left sidebar).
2. Click on **"API"** under Project Settings.
3. Find and copy:
   - **Project URL**: `https://xxxxxxxxxxxx.supabase.co`
   - **Project API Keys** -> `anon` / `public`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...`

---

## Step 4: Configure Your Frontend

Open [`js/supabase-client.js`](file:///c:/Users/Royal/Desktop/AI%20Hackathon/front%20end/js/supabase-client.js) and ensure your keys are configured:

```javascript
const SUPABASE_CONFIG = {
  SUPABASE_URL: "https://fwqpqxbhrthxkddvztht.supabase.co",
  SUPABASE_ANON_KEY: "your-anon-key-here",
  USE_MOCK_STORAGE: false
};
```
