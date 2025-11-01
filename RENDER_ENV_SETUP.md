# Complete Guide: Setting Up Environment Variables in Render

This guide shows you exactly how to add environment variables in Render for your backend deployment.

---

## Step-by-Step Instructions

### Step 1: Access Your Render Dashboard

1. Go to [https://dashboard.render.com/](https://dashboard.render.com/)
2. Sign in to your account
3. You should see your deployed services (or "New +" button if you haven't created one yet)

### Step 2: Navigate to Your Backend Service

1. Find your backend service (e.g., `abunearegawi-backend`)
2. Click on the service name to open its details page
3. You'll see several tabs: **Overview**, **Logs**, **Settings**, **Metrics**, **Shell**, **Events**

### Step 3: Go to Environment Tab

1. Click on the **"Settings"** tab (left sidebar or top navigation)
2. Scroll down to find the **"Environment"** section
3. You'll see a section titled **"Environment Variables"**

### Step 4: Add Environment Variables

#### For Each Environment Variable:

1. **Click "Add Environment Variable"** button
2. **Key**: Enter the variable name (e.g., `NODE_ENV`)
3. **Value**: Enter the variable value (e.g., `production`)
4. **Click "Save Changes"**

**Important:** After adding all variables, Render will automatically redeploy your service.

---

## Complete List of Environment Variables for Render

Add these one by one following the steps above:

### 1. Basic Configuration

**Key:** `NODE_ENV`  
**Value:** `production`  
**Description:** Sets Node.js to production mode

---

**Key:** `PORT`  
**Value:** `10000`  
**Description:** Port for your backend (Render uses port 10000, but can also use env var PORT)

---

### 2. Database Configuration

**Key:** `MONGODB_URI`  
**Value:** `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/church_db?retryWrites=true&w=majority`  
**Description:** Your MongoDB Atlas connection string

**How to get it:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<dbname>` with `church_db` (or your preferred name)

**Example:**
```
mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/church_db?retryWrites=true&w=majority
```

**⚠️ Important:** 
- Make sure to whitelist `0.0.0.0/0` in MongoDB Atlas Network Access (allows all IPs for Render)

---

### 3. Authentication

**Key:** `JWT_SECRET`  
**Value:** Generate a long random string (at least 32 characters)  
**Description:** Secret key for JWT token encryption

**How to generate:**
- Use an online generator: https://randomkeygen.com/
- Or run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Example: `a7f3d9e2b4c8f1a6d3e9b2c7f4a8d1e6b9c2f7a4d8e1b3c6f9a2d5e8b1c4f7`

**⚠️ Keep this secret!** Don't share it publicly.

---

### 4. Frontend URL (Update After Vercel Deploy)

**Key:** `FRONTEND_URL`  
**Value:** `https://your-app-name.vercel.app`  
**Description:** Your Vercel frontend URL (update this after deploying to Vercel)

**Steps:**
1. Deploy to Vercel first (get your Vercel URL)
2. Come back to Render
3. Add this variable with your actual Vercel URL
4. Example: `https://abunearegawi-church.vercel.app`

**If using custom domain:**
- Use your custom domain instead: `https://church.yourdomain.com`

---

### 5. Stripe Configuration

**Key:** `STRIPE_SECRET_KEY`  
**Value:** `sk_live_xxxxxxxxxxxxx` (or `sk_test_...` for testing)  
**Description:** Your Stripe secret key from Stripe Dashboard

**How to get it:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Click on "Developers" → "API keys"
3. Find "Secret key" (click "Reveal test key" or "Reveal live key")
4. Copy the key (starts with `sk_test_` or `sk_live_`)

**⚠️ For Testing:** Use test keys (starts with `sk_test_`)
**⚠️ For Production:** Use live keys (starts with `sk_live_`)

---

**Key:** `STRIPE_PUBLISHABLE_KEY`  
**Value:** `pk_live_xxxxxxxxxxxxx` (or `pk_test_...` for testing)  
**Description:** Your Stripe publishable key (also used in Vercel frontend)

**How to get it:**
1. Same page as above (Stripe Dashboard → API keys)
2. Find "Publishable key"
3. Copy the key (starts with `pk_test_` or `pk_live_`)

**Note:** This same key goes in Vercel as `REACT_APP_STRIPE_PUBLISHABLE_KEY`

---

**Key:** `STRIPE_WEBHOOK_SECRET`  
**Value:** `whsec_xxxxxxxxxxxxx`  
**Description:** Stripe webhook signing secret (set this up AFTER backend is deployed)

**How to get it (after deployment):**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Click "Developers" → "Webhooks"
3. Click "Add endpoint"
4. **Endpoint URL:** `https://your-backend-url.onrender.com/api/payments/webhook`
   - Replace `your-backend-url` with your actual Render URL
   - Example: `https://abunearegawi-backend.onrender.com/api/payments/webhook`
5. Select events to listen to:
   - `payment_intent.succeeded`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
6. Click "Add endpoint"
7. Click on the new webhook endpoint
8. Find "Signing secret" and click "Reveal"
9. Copy the secret (starts with `whsec_`)
10. Add it to Render as `STRIPE_WEBHOOK_SECRET`

**⚠️ Note:** You can only get this AFTER your backend is deployed!

---

### 6. Email Configuration (Optional - for payment reminders)

**Key:** `EMAIL_HOST`  
**Value:** `smtp.gmail.com` (for Gmail)  
**Description:** SMTP server hostname

**Common values:**
- Gmail: `smtp.gmail.com`
- Outlook: `smtp-mail.outlook.com`
- Yahoo: `smtp.mail.yahoo.com`
- Custom SMTP: Check your email provider's settings

---

**Key:** `EMAIL_PORT`  
**Value:** `587`  
**Description:** SMTP server port (587 for TLS, 465 for SSL)

**Common values:**
- TLS: `587`
- SSL: `465`

---

**Key:** `EMAIL_USER`  
**Value:** `your-email@gmail.com`  
**Description:** Your email address

**Example:**
```
church@abunearegawi.org
```

---

**Key:** `EMAIL_PASS`  
**Value:** Your email password or app password  
**Description:** Email password or app-specific password

**For Gmail:**
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Security → 2-Step Verification → App passwords
3. Generate an app password
4. Use that password here (16 characters, no spaces)

**⚠️ Don't use your regular Gmail password!** Use an app password.

---

**Key:** `EMAIL_FROM_NAME`  
**Value:** `Abune Aregawi Church`  
**Description:** Display name for sent emails

**Example:**
```
Abune Aregawi Tigrayans Orthodox Church
```

---

## Visual Guide: Render Dashboard

### Finding Environment Variables Section:

```
Render Dashboard
  └── Your Service (abunearegawi-backend)
      └── Settings Tab
          └── Environment Section
              └── Environment Variables
                  ├── Add Environment Variable Button
                  └── [List of existing variables]
```

### Environment Variable Entry Form:

```
┌─────────────────────────────────────────┐
│ Key: [NODE_ENV                    ]   │
│ Value: [production                ]   │
│                                        │
│ [Save Changes] [Cancel]              │
└─────────────────────────────────────────┘
```

---

## Complete Checklist

Before deploying, make sure you have:

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `MONGODB_URI` = Your MongoDB Atlas connection string
- [ ] `JWT_SECRET` = Generated secret key (32+ characters)
- [ ] `FRONTEND_URL` = Your Vercel URL (update after Vercel deploy)
- [ ] `STRIPE_SECRET_KEY` = Your Stripe secret key
- [ ] `STRIPE_PUBLISHABLE_KEY` = Your Stripe publishable key
- [ ] `STRIPE_WEBHOOK_SECRET` = Set after backend deploy and webhook creation
- [ ] `EMAIL_HOST` = `smtp.gmail.com` (or your provider)
- [ ] `EMAIL_PORT` = `587`
- [ ] `EMAIL_USER` = Your email address
- [ ] `EMAIL_PASS` = Your app password
- [ ] `EMAIL_FROM_NAME` = `Abune Aregawi Church`

---

## After Adding Variables

1. **Click "Save Changes"** for each variable
2. Render will automatically **trigger a redeploy**
3. You can watch the **Logs** tab to see the deployment progress
4. Wait for deployment to complete (usually 2-5 minutes)

---

## Updating Variables Later

1. Go to Settings → Environment
2. Find the variable you want to update
3. Click on it or the edit icon
4. Change the value
5. Click "Save Changes"
6. Service will automatically redeploy

---

## Troubleshooting

### Variable Not Working?
- ✅ Make sure you clicked "Save Changes"
- ✅ Check for typos in variable names (case-sensitive!)
- ✅ Wait for deployment to complete
- ✅ Check logs for errors

### Can't See Environment Tab?
- ✅ Make sure you're on the Settings page
- ✅ Scroll down to find Environment section
- ✅ Make sure you're logged in and own the service

### Deployment Fails?
- ✅ Check logs for specific error messages
- ✅ Verify MongoDB connection string format
- ✅ Make sure all required variables are set
- ✅ Check that values don't have extra spaces

---

## Security Best Practices

1. **Never commit `.env` files** to GitHub
2. **Use strong JWT_SECRET** (32+ random characters)
3. **Use App Passwords** for email (not regular passwords)
4. **Don't share** your environment variables publicly
5. **Use test Stripe keys** during development
6. **Rotate secrets** if they're ever exposed

---

## Next Steps

After setting up environment variables in Render:

1. ✅ Deploy backend to Render
2. ✅ Get your Render backend URL
3. ✅ Deploy frontend to Vercel
4. ✅ Update `FRONTEND_URL` in Render with your Vercel URL
5. ✅ Set up Stripe webhook
6. ✅ Create admin user

Good luck with your deployment! 🚀

