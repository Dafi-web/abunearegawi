# Fix CORS Error - Quick Guide

## Problem

Your frontend (Vercel) is trying to connect to `http://localhost:5001/api` instead of your Render backend, causing CORS errors.

## Solution

You need to set environment variables in both Vercel and Render.

---

## Step 1: Set Environment Variable in Vercel (Frontend)

### Your Vercel URL:
```
https://tigrayans-church.vercel.app
```

### Your Render Backend URL:
(Replace with your actual Render backend URL)
```
https://your-backend-name.onrender.com
```

### Action Required:

1. Go to **Vercel Dashboard** → Your Project (`tigrayans-church`)
2. Click **"Settings"** tab
3. Click **"Environment Variables"** (left sidebar)
4. Click **"Add New"**
5. Add this variable:

   **Key:** `REACT_APP_API_URL`
   
   **Value:** `https://your-backend-name.onrender.com/api`
   
   **Environments:** ✅ Production, ✅ Preview, ✅ Development
   
   **Example:**
   ```
   Key:   REACT_APP_API_URL
   Value: https://abunearegawi-backend.onrender.com/api
   ```

6. Click **"Save"**
7. **Redeploy** your project (go to Deployments → Redeploy)

---

## Step 2: Set Environment Variable in Render (Backend)

### Action Required:

1. Go to **Render Dashboard** → Your Backend Service
2. Click **"Settings"** tab
3. Scroll to **"Environment"** section
4. Find **"FRONTEND_URL"** or click **"Add Environment Variable"**
5. Set the value:

   **Key:** `FRONTEND_URL`
   
   **Value:** `https://tigrayans-church.vercel.app`
   
   **Example:**
   ```
   Key:   FRONTEND_URL
   Value: https://tigrayans-church.vercel.app
   ```

6. Click **"Save Changes"**
7. Render will **automatically redeploy** your backend

---

## Step 3: Verify

After setting both variables:

1. **Wait for redeployments** to complete (2-5 minutes)
2. **Refresh your Vercel site** (hard refresh: Ctrl+Shift+R or Cmd+Shift+R)
3. **Check browser console** - CORS errors should be gone
4. **Test functionality** - try logging in, loading posts, etc.

---

## Important Notes

- ✅ `REACT_APP_API_URL` in Vercel must point to your Render backend + `/api`
- ✅ `FRONTEND_URL` in Render must point to your Vercel frontend
- ✅ Both must include `https://` (not `http://`)
- ✅ No trailing slash in URLs (except `/api` for the API URL)

---

## If You Don't Have Render Backend URL Yet

1. Deploy your backend to Render first (see `QUICK_DEPLOY.md`)
2. Get your Render backend URL (e.g., `https://abunearegawi-backend.onrender.com`)
3. Then set `REACT_APP_API_URL` in Vercel with that URL + `/api`
4. Set `FRONTEND_URL` in Render with your Vercel URL

---

## Quick Checklist

- [ ] Set `REACT_APP_API_URL` in Vercel = `https://your-backend.onrender.com/api`
- [ ] Set `FRONTEND_URL` in Render = `https://tigrayans-church.vercel.app`
- [ ] Redeployed both services
- [ ] Refreshed frontend site
- [ ] Tested - CORS errors are gone!

---

After setting these variables, your frontend will connect to your Render backend correctly! 🚀

