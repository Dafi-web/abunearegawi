# Fix CORS Error - Two Issues Found

## Issues

1. ❌ **API URL Missing `/api`**
   - Current: `https://abunearegawi.onrender.com`
   - Should be: `https://abunearegawi.onrender.com/api`

2. ❌ **CORS Not Allowing Preview Deployments**
   - Vercel creates preview URLs like: `tigrayans-church-p161n02sq-dawit-abrhas-projects.vercel.app`
   - Backend wasn't allowing these

---

## Fix 1: Update API URL in Vercel

### Go to Vercel Dashboard:

1. **Project:** `tigrayans-church`
2. **Settings** → **Environment Variables**
3. Find **`REACT_APP_API_URL`**
4. **Change it to:**

```
REACT_APP_API_URL = https://abunearegawi.onrender.com/api
```

⚠️ **Important:** Must end with `/api`

5. **Save**
6. **Redeploy** your project

---

## Fix 2: CORS Already Fixed

I've updated the backend code to allow all Vercel deployments:
- ✅ Production: `tigrayans-church.vercel.app`
- ✅ Preview: `tigrayans-church-*.vercel.app`
- ✅ Any Vercel deployment

**Action needed:** Redeploy your backend to Render (the code is already pushed)

---

## Fix 3: Set FRONTEND_URL in Render (Important!)

1. Go to **Render Dashboard** → Your backend service
2. **Settings** → **Environment**
3. Set or update:

```
FRONTEND_URL = https://tigrayans-church.vercel.app
```

4. **Save Changes** (auto-redeploys)

---

## After Fixes

1. ✅ Wait for both redeployments (2-5 minutes)
2. ✅ Refresh your Vercel site
3. ✅ CORS errors should be gone!

---

## Quick Checklist

- [ ] Set `REACT_APP_API_URL` = `https://abunearegawi.onrender.com/api` in Vercel
- [ ] Redeploy Vercel project
- [ ] Set `FRONTEND_URL` = `https://tigrayans-church.vercel.app` in Render
- [ ] Wait for Render to redeploy
- [ ] Test your site

---

**Most Important:** Make sure your API URL in Vercel ends with `/api`! 🚀

