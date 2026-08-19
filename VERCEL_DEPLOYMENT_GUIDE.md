# 🚀 Complete Vercel Deployment & Supabase Production Guide

This guide will walk you through deploying your **AuraMed AI** web application to **Vercel** in minutes, while ensuring that **Supabase Authentication**, **Database RLS**, and future **FastAPI RAG requests** work seamlessly in production.

---

## 📋 Table of Contents
1. [Option A: Deploy via GitHub (Recommended)](#1-option-a-deploy-via-github-recommended)
2. [Option B: Deploy via Vercel CLI (Fastest)](#2-option-b-deploy-via-vercel-cli-fastest)
3. [CRITICAL: Supabase Production URL Configuration](#3-critical-supabase-production-url-configuration)
4. [How Supabase Client Keys Work in Production](#4-how-supabase-client-keys-work-in-production)
5. [Connecting to your FastAPI Backend from Vercel](#5-connecting-to-your-fastapi-backend-from-vercel)
6. [Pre-Flight Verification Checklist](#6-pre-flight-verification-checklist)

---

## 1. Option A: Deploy via GitHub (Recommended)

This is the standard, best-practice way to deploy to Vercel:

1. **Push your code to GitHub**:
   - Create a repository on GitHub (e.g., `auramed-frontend`).
   - Push the contents of the `Front end code` folder to the repository.

2. **Connect to Vercel**:
   - Go to [https://vercel.com](https://vercel.com) and log in with your GitHub account.
   - Click **"Add New..."** ➔ **"Project"**.
   - Select your `auramed-frontend` repository and click **"Import"**.

3. **Configure Project Settings**:
   - **Framework Preset**: Select **"Other"** (since this is Vanilla HTML/JS/Tailwind CDN).
   - **Root Directory**: `./` (or `Front end code` if your repo root contains other folders).
   - Click **"Deploy"**.

4. **Done!** Vercel will give you a live HTTPS domain (e.g., `https://auramed-ai.vercel.app`).

---

## 2. Option B: Deploy via Vercel CLI (Fastest, 1 Command)

If you have Node.js installed, you can deploy directly from your command line without GitHub:

1. Open PowerShell or Terminal in your project directory:
   ```bash
   cd "c:\Users\Royal\Desktop\AI Hackathon\Front end code"
   ```

2. Install Vercel CLI (if not already installed):
   ```bash
   npm install -g vercel
   ```

3. Run the deploy command:
   ```bash
   vercel
   ```

4. Follow the prompt questions:
   - *Set up and deploy?* ➔ `Y`
   - *Which scope?* ➔ `[Your Name/Team]`
   - *Link to existing project?* ➔ `N`
   - *Project name?* ➔ `auramed-ai`
   - *In which directory is your code located?* ➔ `./`
   - *Want to modify settings?* ➔ `N`

5. For a production release, run:
   ```bash
   vercel --prod
   ```

---

## 3. CRITICAL: Supabase Production URL Configuration

When you host on Vercel, your app will be served under a custom URL like `https://auramed-ai.vercel.app`. **You must add this URL to your Supabase Auth whitelist**, otherwise authentication redirects and confirmation links will be rejected.

### Steps in Supabase Dashboard:
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and select your project (`AI Hackathon`).
2. On the left sidebar, click **"Authentication"** (user icon) ➔ **"URL Configuration"**.
3. **Site URL**:
   - Set to your primary Vercel production URL:
     ```
     https://auramed-ai.vercel.app
     ```
4. **Redirect URLs** (Whitelisted Callbacks):
   - Add both your production URL and wildcard preview URLs:
     ```
     https://auramed-ai.vercel.app/**
     https://*.vercel.app/**
     http://localhost:5500/**
     http://127.0.0.1:5500/**
     ```
5. Click **"Save"**.

> [!IMPORTANT]
> Because we already created the database trigger `on_auth_user_created_auto_confirm` in Supabase, signups are confirmed instantly without requiring email verification delays!

---

## 4. How Supabase Client Keys Work in Production

In [`js/supabase-client.js`](file:///c:/Users/Royal/Desktop/AI%20Hackathon/Front%20end%20code/js/supabase-client.js):

- Your Supabase Project URL (`https://fwqpqxbhrthxkddvztht.supabase.co`) and **Publishable `anon` Key** are designed to be client-facing in browser applications.
- Security is strictly enforced on the server by Supabase **Row-Level Security (RLS)** policies.
- Ensure `USE_MOCK_STORAGE: false` is set in `js/supabase-client.js` so it connects to your live Supabase cloud instance.

---

## 5. Connecting to your FastAPI Backend from Vercel

When your FastAPI backend is ready, keep these 3 production rules in mind:

### 1. Mixed Content (HTTPS ➔ HTTPS)
- Vercel automatically forces **HTTPS** on all deployments.
- Browsers block requests from an `https://` site to an insecure `http://` API (e.g. `http://api.mybackend.com`).
- **Make sure your FastAPI server is hosted with HTTPS** (e.g. using Render, Railway, Fly.io, DigitalOcean, or AWS with an SSL certificate).

### 2. CORS on FastAPI
Make sure your FastAPI backend allows requests from your Vercel domain:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://auramed-ai.vercel.app",
        "https://*.vercel.app",
        "http://localhost:5500",
        "*"  # Or allow all during prototype phase
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Vercel API Rewrites (Alternative Zero-CORS method)
In your [`vercel.json`](file:///c:/Users/Royal/Desktop/AI%20Hackathon/Front%20end%20code/vercel.json), you can route `/api/chat` directly to your backend URL:
```json
{
  "rewrites": [
    {
      "source": "/api/chat",
      "destination": "https://your-fastapi-backend.onrender.com/api/chat"
    }
  ]
}
```
This lets the frontend call `fetch('/api/chat')` as a same-origin request with zero CORS issues!

---

## 6. Pre-Flight Verification Checklist

Before sharing your Vercel URL with users:

- [x] **`index.html`** gateway created (automatically redirects logged-in users to `assistant.html` and guests to `login.html`).
- [x] **`vercel.json`** configured with clean URLs and security headers.
- [ ] **Supabase Auth URL Configuration** updated with your `*.vercel.app` domain.
- [ ] **Test Sign Up & Login** on the live Vercel URL.
- [ ] **Test Clinical Intake Form** (verify that pregnancy data, conditions, and vitals save to Supabase `public.patients`).
- [ ] **Test Medicine Bar** (verify adding medicines saves to Supabase `public.patient_medicines`).
- [ ] **Test Arabic & Dark Mode toggles** across all pages.
