# Deployment Guide - Vercel (Frontend) & Render (Backend)

This guide will help you deploy the Abune Aregawi Church website to Vercel (frontend) and Render (backend).

## Prerequisites

1. GitHub account
2. Vercel account (free tier available)
3. Render account (free tier available)
4. MongoDB Atlas account (for database)
5. Stripe account (for payments)
6. Domain name (optional, for custom domain)

---

## Part 1: Deploy Backend to Render

### Step 1: Push Code to GitHub

1. Make sure your code is pushed to GitHub:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

### Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select your repository

### Step 3: Configure Render Service

**Basic Settings:**
- **Name**: `abunearegawi-backend` (or your preferred name)
- **Region**: Choose closest to your users (Oregon is default)
- **Branch**: `main`
- **Root Directory**: `server`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (or paid for better performance)

**Or use render.yaml (already created):**
- The `render.yaml` file is already configured
- Click "Create Web Service" and Render will auto-detect the config

### Step 4: Set Environment Variables in Render

Go to Environment tab and add:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/church_db?retryWrites=true&w=majority
JWT_SECRET=your-very-secret-jwt-key-change-this
FRONTEND_URL=https://your-vercel-app.vercel.app
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM_NAME=Abune Aregawi Church
```

**Important Notes:**
- Replace `MONGODB_URI` with your MongoDB Atlas connection string
- Generate a strong `JWT_SECRET` (random string)
- Get Stripe keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- For Gmail, use [App Password](https://myaccount.google.com/apppasswords)

### Step 5: Deploy

1. Click "Create Web Service"
2. Render will build and deploy your backend
3. Note your backend URL: `https://abunearegawi-backend.onrender.com`

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

Or use Vercel Dashboard (recommended for first time).

### Step 2: Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select your repository

### Step 3: Configure Vercel Project

**Framework Preset**: Other (or Next.js if you want)
**Root Directory**: `client`
**Build Command**: `npm run build`
**Output Directory**: `build`
**Install Command**: `npm install`

### Step 4: Set Environment Variables in Vercel

Go to Settings → Environment Variables:

```
REACT_APP_API_URL=https://abunearegawi-backend.onrender.com/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
```

**Important:**
- Replace `REACT_APP_API_URL` with your Render backend URL
- Use the same Stripe publishable key as backend

### Step 5: Deploy

1. Click "Deploy"
2. Vercel will build and deploy your frontend
3. You'll get a URL like: `https://abunearegawi-client.vercel.app`

---

## Part 3: Final Configuration

### Update Backend FRONTEND_URL

1. Go back to Render Dashboard
2. Update `FRONTEND_URL` environment variable with your Vercel URL
3. Save and redeploy backend

### Update Frontend API URL

1. Go to Vercel Dashboard
2. Update `REACT_APP_API_URL` with your Render backend URL
3. Redeploy frontend

### Set Up Stripe Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Endpoint URL: `https://your-backend-url.onrender.com/api/payments/webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
5. Copy webhook signing secret and add to Render environment variables as `STRIPE_WEBHOOK_SECRET`

---

## Part 4: Create Admin User

After deployment, you need to create an admin user. You have two options:

### Option 1: Use Render Shell

1. Go to Render Dashboard → Your Service
2. Click "Shell"
3. Run:
   ```bash
   cd server
   npm run create-admin
   ```

### Option 2: Create via API

Use Postman or curl to create admin via the register endpoint, then update role in MongoDB.

---

## Part 5: Custom Domain (Optional)

### Vercel Custom Domain

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

### Render Custom Domain

1. Go to Render Dashboard → Your Service → Settings → Custom Domain
2. Add your domain
3. Configure DNS with provided CNAME record

---

## Troubleshooting

### Backend Issues

- **MongoDB Connection Failed**: Check `MONGODB_URI` and MongoDB Atlas IP whitelist (add `0.0.0.0/0`)
- **CORS Errors**: Verify `FRONTEND_URL` in Render matches your Vercel URL
- **Server Crashes**: Check Render logs for errors

### Frontend Issues

- **API Connection Failed**: Verify `REACT_APP_API_URL` in Vercel
- **Build Failures**: Check Vercel build logs
- **404 Errors**: Verify `vercel.json` routing configuration

### Common Fixes

1. **Clear build cache** in both platforms
2. **Redeploy** after environment variable changes
3. **Check logs** for specific error messages
4. **Verify all environment variables** are set correctly

---

## Environment Variables Checklist

### Render (Backend)
- [ ] MONGODB_URI
- [ ] JWT_SECRET
- [ ] FRONTEND_URL
- [ ] STRIPE_SECRET_KEY
- [ ] STRIPE_WEBHOOK_SECRET
- [ ] STRIPE_PUBLISHABLE_KEY
- [ ] EMAIL_HOST
- [ ] EMAIL_USER
- [ ] EMAIL_PASS

### Vercel (Frontend)
- [ ] REACT_APP_API_URL
- [ ] REACT_APP_STRIPE_PUBLISHABLE_KEY

---

## Free Tier Limits

### Render
- Services may spin down after 15 minutes of inactivity
- First request after spin-down may be slow (~30 seconds)
- Consider paid plan for production

### Vercel
- Generous free tier
- Automatic deployments
- No spin-down issues

---

## Support

If you encounter issues:
1. Check both platform logs
2. Verify all environment variables
3. Test API endpoints directly
4. Check MongoDB Atlas connection
5. Verify Stripe webhook configuration

Good luck with your deployment! 🚀

