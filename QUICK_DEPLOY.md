# Quick Deployment Guide

## 🚀 Deploy Backend to Render (5 minutes)

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
   - Sign up/login with GitHub

2. **Click "New +" → "Web Service"**
   - Connect your GitHub repo
   - Select your repository

3. **Configure:**
   - **Name**: `abunearegawi-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secret_key_here
   FRONTEND_URL=https://your-vercel-app.vercel.app (update after Vercel deploy)
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM_NAME=Abune Aregawi Church
   ```

5. **Click "Create Web Service"**
   - Wait for build (~5 minutes)
   - Copy your backend URL: `https://xxx.onrender.com`

---

## 🌐 Deploy Frontend to Vercel (3 minutes)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
   - Sign up/login with GitHub

2. **Click "Add New..." → "Project"**
   - Import your GitHub repository

3. **Configure:**
   - **Framework Preset**: Other
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. **Add Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

5. **Click "Deploy"**
   - Wait for build (~2 minutes)
   - Copy your frontend URL: `https://xxx.vercel.app`

---

## ✅ Final Steps

1. **Update Backend FRONTEND_URL** in Render:
   - Go to Environment tab
   - Update `FRONTEND_URL` with your Vercel URL
   - Save and redeploy

2. **Create Admin User:**
   - Go to Render → Your Service → Shell
   - Run: `cd server && npm run create-admin`

3. **Set Up Stripe Webhook:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
   - Add endpoint: `https://your-backend-url.onrender.com/api/payments/webhook`
   - Select events: `payment_intent.succeeded`, `invoice.payment_succeeded`, etc.
   - Copy secret and add to Render as `STRIPE_WEBHOOK_SECRET`

---

## 📝 Important Notes

- **MongoDB Atlas**: Allow IP `0.0.0.0/0` for Render to connect
- **Render Free Tier**: Services spin down after 15 min inactivity (first request may be slow)
- **Environment Variables**: Must be set before deployment
- **CORS**: Backend will automatically allow your Vercel frontend URL

---

## 🆘 Troubleshooting

**Backend won't start?**
- Check Render logs
- Verify MongoDB connection string
- Check all environment variables are set

**Frontend can't connect to API?**
- Verify `REACT_APP_API_URL` in Vercel
- Check CORS settings in backend
- Make sure backend is running (check Render dashboard)

**MongoDB connection failed?**
- Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access
- Double-check connection string

---

That's it! Your app should be live! 🎉

