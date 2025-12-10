# Environment Variables - Complete Explanation

## Summary: Where to Set Variables

| Location | For | Variables |
|----------|-----|-----------|
| **Vercel Dashboard** | Frontend (client) deployment | `REACT_APP_API_URL`, `REACT_APP_STRIPE_PUBLISHABLE_KEY` |
| **Render Dashboard** | Backend (server) deployment | `FRONTEND_URL`, `MONGODB_URI`, `JWT_SECRET`, `STRIPE_*`, `EMAIL_*`, etc. |
| **client/.env** | Local frontend development | Same as Vercel |
| **server/.env** | Local backend development | Same as Render |

---

## 1. For Deployment (Production)

### ✅ Vercel Dashboard (Frontend/Client)

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

**Set these variables:**

```
REACT_APP_API_URL = https://your-backend-name.onrender.com/api
REACT_APP_STRIPE_PUBLISHABLE_KEY = pk_test_your_key_here
```

**Important:**
- Replace `your-backend-name.onrender.com` with your actual Render backend URL
- These are used by your React app in production

---

### ✅ Render Dashboard (Backend/Server)

Go to: **Render Dashboard → Your Service → Settings → Environment**

**Set these variables:**

```
NODE_ENV = production
PORT = 10000
MONGODB_URI = mongodb+srv://...
JWT_SECRET = your_secret_here
FRONTEND_URL = https://tigrayans-church.vercel.app
STRIPE_SECRET_KEY = sk_test_...
STRIPE_PUBLISHABLE_KEY = pk_test_...
STRIPE_WEBHOOK_SECRET = whsec_...
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_USER = your_email@gmail.com
EMAIL_PASS = your_app_password
EMAIL_FROM_NAME = Abune Aregawi Church
CLOUDINARY_CLOUD_NAME = your_cloudinary_cloud_name
CLOUDINARY_API_KEY = your_cloudinary_api_key
CLOUDINARY_API_SECRET = your_cloudinary_api_secret
```

**Important:**
- Replace `https://tigrayans-church.vercel.app` with your actual Vercel URL
- These are used by your Node.js server in production

---

## 2. For Local Development

### ✅ client/.env File (Frontend)

Create a file: `client/.env`

```env
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

**Used when:** Running `npm start` in the `client` directory

---

### ✅ server/.env File (Backend)

Create a file: `server/.env`

```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/church_db
JWT_SECRET=your_secret_here
FRONTEND_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM_NAME=Abune Aregawi Church
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Used when:** Running `npm start` or `npm run dev` in the `server` directory

---

## Key Differences

### Deployment (Vercel & Render):
- ❌ No `.env` files needed
- ✅ Set variables in their dashboards
- ✅ Variables are stored securely in their systems
- ✅ Automatically available when code runs

### Local Development:
- ✅ Use `.env` files in each directory
- ✅ `client/.env` for frontend
- ✅ `server/.env` for backend
- ⚠️ Never commit `.env` files to Git (they're in `.gitignore`)

---

## Quick Setup Guide

### For Production (Deployment):

1. **Deploy backend to Render**
   - Get your Render URL: `https://your-backend.onrender.com`
   - Set all variables in Render Dashboard

2. **Deploy frontend to Vercel**
   - Get your Vercel URL: `https://tigrayans-church.vercel.app`
   - Set `REACT_APP_API_URL` in Vercel Dashboard = `https://your-backend.onrender.com/api`
   - Set `REACT_APP_STRIPE_PUBLISHABLE_KEY` in Vercel

3. **Update Render**
   - Set `FRONTEND_URL` in Render = `https://tigrayans-church.vercel.app`
   - Redeploy

---

### For Local Development:

1. **Backend:**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your local values
   npm start
   ```

2. **Frontend:**
   ```bash
   cd client
   cp .env.example .env
   # Edit .env with your local values
   npm start
   ```

---

## Current Issue Fix

**Your CORS error is happening because:**

1. ❌ `REACT_APP_API_URL` is not set in Vercel
   - Frontend is using default: `http://localhost:5001/api`
   - **Fix:** Set in Vercel Dashboard = `https://your-backend.onrender.com/api`

2. ❌ `FRONTEND_URL` is not set in Render
   - Backend CORS is using default: `http://localhost:3000`
   - **Fix:** Set in Render Dashboard = `https://tigrayans-church.vercel.app`

---

## Environment Variable Naming

### Frontend (React):
- Must start with `REACT_APP_` prefix
- Example: `REACT_APP_API_URL`
- Only these are accessible in React code

### Backend (Node.js):
- Any name (no prefix required)
- Example: `FRONTEND_URL`, `MONGODB_URI`, `JWT_SECRET`

---

## Example `.env` Files

I've created example files:
- `client/.env.example` - Copy to `client/.env` for local dev
- `server/.env.example` - Copy to `server/.env` for local dev

**To use them:**
```bash
# Copy example files
cd client && cp .env.example .env
cd ../server && cp .env.example .env

# Edit with your actual values
# (Never commit .env files to Git!)
```

---

## Summary

- **Deployment:** Set variables in Vercel & Render dashboards
- **Local Dev:** Use `.env` files in `client/` and `server/` directories
- **Never commit `.env` files** to Git (already in `.gitignore`)
- **Current fix:** Set `REACT_APP_API_URL` in Vercel and `FRONTEND_URL` in Render

---

That's it! 🚀

