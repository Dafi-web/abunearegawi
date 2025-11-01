# Where to Set Environment Variables - Simple Guide

## Your Project Structure

```
abunearegawi/
├── client/          ← Frontend (React app)
└── server/          ← Backend (Node.js/Express)
```

---

## For DEPLOYMENT (Production)

### ✅ CLIENT (Frontend) → Set in Vercel Dashboard

**Your frontend is deployed to:** `https://tigrayans-church.vercel.app`

**Go to:**
- Vercel Dashboard
- Click on your project `tigrayans-church`
- Settings → Environment Variables

**Add these variables:**

```
REACT_APP_API_URL = https://your-backend.onrender.com/api
REACT_APP_STRIPE_PUBLISHABLE_KEY = pk_test_...
```

**This tells your React app (in `client/` folder) where to find your backend.**

---

### ✅ SERVER (Backend) → Set in Render Dashboard

**Your backend is deployed to:** `https://your-backend.onrender.com` (your Render URL)

**Go to:**
- Render Dashboard
- Click on your backend service
- Settings → Environment

**Add these variables:**

```
NODE_ENV = production
PORT = 10000
MONGODB_URI = mongodb+srv://...
JWT_SECRET = your_secret
FRONTEND_URL = https://tigrayans-church.vercel.app
STRIPE_SECRET_KEY = sk_test_...
STRIPE_PUBLISHABLE_KEY = pk_test_...
EMAIL_HOST = smtp.gmail.com
EMAIL_USER = your_email@gmail.com
EMAIL_PASS = your_password
```

**This tells your Node.js server (in `server/` folder) how to connect to database, Stripe, and which frontend to allow.**

---

## For LOCAL DEVELOPMENT (On Your Computer)

### ✅ CLIENT (Frontend) → Create `client/.env` file

**Location:** `client/.env`

```env
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Used when:** You run `npm start` in the `client` folder

---

### ✅ SERVER (Backend) → Create `server/.env` file

**Location:** `server/.env`

```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/church_db
JWT_SECRET=your_secret
FRONTEND_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_password
```

**Used when:** You run `npm start` in the `server` folder

---

## Visual Summary

```
┌─────────────────────────────────────────────────┐
│ DEPLOYMENT (Production)                        │
├─────────────────────────────────────────────────┤
│                                                 │
│ CLIENT (client/ folder)                         │
│ └── Set in: VERCEL Dashboard                   │
│     Variables:                                  │
│     • REACT_APP_API_URL                         │
│     • REACT_APP_STRIPE_PUBLISHABLE_KEY          │
│                                                 │
│ SERVER (server/ folder)                         │
│ └── Set in: RENDER Dashboard                   │
│     Variables:                                  │
│     • FRONTEND_URL                              │
│     • MONGODB_URI                               │
│     • JWT_SECRET                                │
│     • STRIPE_SECRET_KEY                         │
│     • etc...                                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ LOCAL DEVELOPMENT (Your Computer)              │
├─────────────────────────────────────────────────┤
│                                                 │
│ CLIENT (client/ folder)                         │
│ └── Create: client/.env file                   │
│     Variables:                                  │
│     • REACT_APP_API_URL                         │
│     • REACT_APP_STRIPE_PUBLISHABLE_KEY          │
│                                                 │
│ SERVER (server/ folder)                         │
│ └── Create: server/.env file                   │
│     Variables:                                  │
│     • FRONTEND_URL                              │
│     • MONGODB_URI                               │
│     • JWT_SECRET                                │
│     • STRIPE_SECRET_KEY                         │
│     • etc...                                    │
└─────────────────────────────────────────────────┘
```

---

## Current Problem & Fix

**Your CORS error is happening because:**

1. ❌ **CLIENT** - `REACT_APP_API_URL` is not set in Vercel
   - Frontend doesn't know where backend is
   - **Fix:** Set in Vercel Dashboard

2. ❌ **SERVER** - `FRONTEND_URL` is not set in Render  
   - Backend doesn't know which frontend to allow
   - **Fix:** Set in Render Dashboard

---

## Step-by-Step Fix

### Step 1: Deploy Backend to Render (if not done)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Create new Web Service
3. Connect your GitHub repo
4. Set Root Directory: `server`
5. Set all environment variables (see `RENDER_ENV_SETUP.md`)
6. Deploy and get your Render URL

### Step 2: Set Variables in Vercel (CLIENT)

1. Go to Vercel Dashboard → `tigrayans-church` project
2. Settings → Environment Variables
3. Add:
   ```
   REACT_APP_API_URL = https://your-backend.onrender.com/api
   ```
4. Save and redeploy

### Step 3: Set Variables in Render (SERVER)

1. Go to Render Dashboard → Your backend service
2. Settings → Environment
3. Add:
   ```
   FRONTEND_URL = https://tigrayans-church.vercel.app
   ```
4. Save (auto-redeploys)

---

## Summary

| Where | For | Set Variables In |
|-------|-----|------------------|
| **client/** | Frontend | Vercel Dashboard (production) or `client/.env` (local) |
| **server/** | Backend | Render Dashboard (production) or `server/.env` (local) |

**That's it!** 🚀

