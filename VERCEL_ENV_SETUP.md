# Complete Guide: Setting Up Environment Variables in Vercel

This guide shows you exactly how to add environment variables in Vercel for your frontend deployment.

---

## Step-by-Step Instructions

### Step 1: Access Your Vercel Dashboard

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Sign in to your account
3. You'll see your projects (or "Add New..." if you haven't created one yet)

### Step 2: Navigate to Your Project

1. Find your project (e.g., `abunearegawi-church` or your project name)
2. Click on the project name to open it
3. You'll see tabs: **Overview**, **Deployments**, **Settings**, **Analytics**, **Logs**

### Step 3: Go to Environment Variables

1. Click on the **"Settings"** tab (in the top navigation)
2. In the left sidebar, click **"Environment Variables"**
3. You'll see a page showing all environment variables

### Step 4: Add Environment Variables

#### For Each Environment Variable:

1. **Scroll down** to the "Environment Variables" section
2. **Click "Add New"** button
3. **Key**: Enter the variable name (e.g., `REACT_APP_API_URL`)
4. **Value**: Enter the variable value (e.g., `https://your-backend.onrender.com/api`)
5. **Environment**: Select which environments to apply to:
   - ✅ **Production** (for live site)
   - ✅ **Preview** (for preview deployments)
   - ✅ **Development** (for local development)
   - **Recommendation:** Select all three (Production, Preview, Development)
6. **Click "Save"**

**Important:** After adding variables, you need to redeploy for changes to take effect.

---

## Required Environment Variables for Vercel

Add these environment variables:

---

### 1. Backend API URL

**Key:** `REACT_APP_API_URL`  
**Value:** `https://your-backend-url.onrender.com/api`  
**Environment:** Production, Preview, Development

**Steps to get the value:**
1. First, deploy your backend to Render
2. Get your Render backend URL (e.g., `https://abunearegawi-backend.onrender.com`)
3. Add `/api` at the end
4. Full URL: `https://abunearegawi-backend.onrender.com/api`

**Example:**
```
Key: REACT_APP_API_URL
Value: https://abunearegawi-backend.onrender.com/api
```

**If using custom domain:**
```
Value: https://api-church.yourdomain.com/api
```

---

### 2. Stripe Publishable Key

**Key:** `REACT_APP_STRIPE_PUBLISHABLE_KEY`  
**Value:** `pk_live_xxxxxxxxxxxxx` (or `pk_test_...` for testing)  
**Environment:** Production, Preview, Development

**How to get it:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Click on **"Developers"** → **"API keys"**
3. Find **"Publishable key"**
4. Copy the key (starts with `pk_test_` or `pk_live_`)

**For Testing:**
```
Value: pk_test_51ABC123...your_key_here
```

**For Production:**
```
Value: pk_live_51XYZ789...your_key_here
```

**⚠️ Important:** 
- Use **test keys** during development/testing
- Use **live keys** for production
- This should match the `STRIPE_PUBLISHABLE_KEY` in your Render backend

---

## Visual Guide: Vercel Dashboard

### Finding Environment Variables:

```
Vercel Dashboard
  └── Your Project
      └── Settings Tab
          └── Environment Variables (left sidebar)
              └── Environment Variables Page
                  ├── Add New Button
                  └── [List of existing variables]
```

### Environment Variable Entry Form:

```
┌─────────────────────────────────────────────────┐
│ Add Environment Variable                       │
├─────────────────────────────────────────────────┤
│                                                 │
│ Key *                                          │
│ [REACT_APP_API_URL                        ]   │
│                                                 │
│ Value *                                        │
│ [https://your-backend.onrender.com/api    ]   │
│                                                 │
│ Environment (select all that apply)             │
│ ☑ Production                                   │
│ ☑ Preview                                      │
│ ☑ Development                                  │
│                                                 │
│ [Save] [Cancel]                               │
└─────────────────────────────────────────────────┘
```

---

## Complete Checklist

Before deploying, make sure you have:

- [ ] `REACT_APP_API_URL` = Your Render backend URL + `/api`
- [ ] `REACT_APP_STRIPE_PUBLISHABLE_KEY` = Your Stripe publishable key

---

## After Adding Variables

### Option 1: Automatic Redeploy

1. After adding/updating variables, Vercel may ask if you want to redeploy
2. Click **"Redeploy"** to apply changes immediately

### Option 2: Manual Redeploy

1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click the **"..."** (three dots) menu
4. Select **"Redeploy"**
5. Or click **"Redeploy"** button if available

### Option 3: Trigger New Deploy

1. Make a small commit to your repository
2. Push to GitHub
3. Vercel will automatically deploy with new environment variables

---

## Important Notes

### Variable Name Format

- **Must start with `REACT_APP_`** for React apps
- Vercel will only expose variables that start with `REACT_APP_` to your React app
- Other variables won't be accessible in your React code

**✅ Correct:**
- `REACT_APP_API_URL`
- `REACT_APP_STRIPE_PUBLISHABLE_KEY`

**❌ Wrong:**
- `API_URL` (won't be exposed to React)
- `STRIPE_KEY` (won't be exposed to React)

---

### Getting Your Render Backend URL

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click on your backend service
3. Look at the top of the page
4. You'll see a URL like: `https://abunearegawi-backend.onrender.com`
5. Add `/api` to the end: `https://abunearegawi-backend.onrender.com/api`

---

### Environment Selection

**Production:**
- Used for your live site (main domain)
- Most important one

**Preview:**
- Used for preview deployments (pull requests, branches)
- Good to have for testing

**Development:**
- Used when running `vercel dev` locally
- Optional, but helpful

**Recommendation:** Select all three for consistency

---

## Updating Variables Later

1. Go to **Settings** → **Environment Variables**
2. Find the variable you want to update
3. Click on the **pencil icon** (edit) or click the variable
4. Update the **Value**
5. Click **"Save"**
6. **Redeploy** your project (see methods above)

---

## Verifying Variables Are Set

### Check in Vercel:

1. Go to **Settings** → **Environment Variables**
2. You should see all your variables listed
3. Check that they're enabled for the right environments

### Check in Your Code:

Your React code uses these variables like this:
```javascript
// In your code (client/src/utils/api.js)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
```

After deployment, `process.env.REACT_APP_API_URL` will be your Render URL.

---

## Troubleshooting

### Variables Not Working?

- ✅ Make sure variable name starts with `REACT_APP_`
- ✅ Check for typos in variable names
- ✅ Verify you redeployed after adding variables
- ✅ Check browser console for errors
- ✅ Verify the value is correct (no extra spaces)

### API Connection Failed?

- ✅ Verify `REACT_APP_API_URL` is correct
- ✅ Make sure backend is running (check Render)
- ✅ Check that URL ends with `/api`
- ✅ Test the backend URL directly in browser

### Stripe Not Working?

- ✅ Verify `REACT_APP_STRIPE_PUBLISHABLE_KEY` is set
- ✅ Make sure you're using the correct key (test vs live)
- ✅ Check Stripe Dashboard for key status
- ✅ Ensure it matches backend Stripe key

### Build Fails?

- ✅ Check build logs in Vercel
- ✅ Verify all required variables are set
- ✅ Check for syntax errors in variable values
- ✅ Make sure variable names are correct

---

## Example: Complete Setup

### Step 1: Add REACT_APP_API_URL

```
Key: REACT_APP_API_URL
Value: https://abunearegawi-backend.onrender.com/api
Environments: ✅ Production, ✅ Preview, ✅ Development
```

### Step 2: Add REACT_APP_STRIPE_PUBLISHABLE_KEY

```
Key: REACT_APP_STRIPE_PUBLISHABLE_KEY
Value: pk_test_51ABC123def456GHI789jkl012MNO345pqr678STU901vwx234YZa567bcd890EFG123hij456KLM789nop012QRS345tuv678WXY901yz
Environments: ✅ Production, ✅ Preview, ✅ Development
```

### Step 3: Save and Redeploy

1. Click **"Save"** for each variable
2. Go to **Deployments** tab
3. Click **"Redeploy"** on latest deployment
4. Wait for deployment to complete

---

## Security Best Practices

1. **Never commit** `.env` files to GitHub
2. **Use test keys** during development
3. **Don't expose** secret keys in frontend (only publishable keys)
4. **Rotate keys** if exposed
5. **Use environment-specific** values when needed

---

## Next Steps

After setting up environment variables in Vercel:

1. ✅ Verify all variables are set
2. ✅ Redeploy your frontend
3. ✅ Test the deployed site
4. ✅ Verify API connection works
5. ✅ Test Stripe payments (in test mode)

Your frontend should now be able to connect to your backend! 🎉

