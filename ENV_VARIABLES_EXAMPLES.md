# Environment Variables Examples - Quick Reference

This guide shows the exact format for environment variables in both Render and Vercel.

---

## 🔧 Format Example

When adding environment variables, you'll see:

```
Key:   EXAMPLE_NAME
Value: I9JU23NF394R6HH
```

---

## 🚀 Render (Backend) Environment Variables

### Complete List with Example Values:

#### 1. Basic Configuration

**Key:** `NODE_ENV`  
**Value:** `production`

---

**Key:** `PORT`  
**Value:** `10000`

---

#### 2. Database

**Key:** `MONGODB_URI`  
**Value:** `mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/church_db?retryWrites=true&w=majority`

**Real Example:**
```
Key:   MONGODB_URI
Value: mongodb+srv://churchadmin:ChurchPass2024@cluster0.x7y8z9.mongodb.net/church_db?retryWrites=true&w=majority
```

---

#### 3. Authentication

**Key:** `JWT_SECRET`  
**Value:** `a7f3d9e2b4c8f1a6d3e9b2c7f4a8d1e6b9c2f7a4d8e1b3c6f9a2d5e8b1c4f7`

**Real Example:**
```
Key:   JWT_SECRET
Value: k9J2mN8pQ5rT3vW7xY1zA4bC6dE8fG0hI2jK4lM6nO8pQ0rS2tU4vW6xY8z
```

**Generate one:**
- Go to: https://randomkeygen.com/
- Use "CodeIgniter Encryption Keys" (256-bit)
- Or run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

#### 4. Frontend URL (Update After Vercel Deploy)

**Key:** `FRONTEND_URL`  
**Value:** `https://abunearegawi-church.vercel.app`

**Real Example:**
```
Key:   FRONTEND_URL
Value: https://abunearegawi-church.vercel.app
```

**After deploying to Vercel:**
- Replace with your actual Vercel URL
- Or your custom domain: `https://church.yourdomain.com`

---

#### 5. Stripe Configuration

**Key:** `STRIPE_SECRET_KEY`  
**Value:** `sk_test_51...your_key_here...` (or `sk_live_...` for production)

**Example Format:**
```
Key:   STRIPE_SECRET_KEY
Value: sk_test_your_actual_secret_key_here_from_stripe_dashboard
```

**Note:** Replace with your actual key from Stripe Dashboard

**Get from:** [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys)

---

**Key:** `STRIPE_PUBLISHABLE_KEY`  
**Value:** `pk_test_51...your_key_here...` (or `pk_live_...` for production)

**Example Format:**
```
Key:   STRIPE_PUBLISHABLE_KEY
Value: pk_test_your_actual_publishable_key_here_from_stripe_dashboard
```

**Note:** Replace with your actual key from Stripe Dashboard

**⚠️ Important:** This same key also goes in Vercel as `REACT_APP_STRIPE_PUBLISHABLE_KEY`

---

**Key:** `STRIPE_WEBHOOK_SECRET`  
**Value:** `whsec_...your_secret_here...`

**Example Format:**
```
Key:   STRIPE_WEBHOOK_SECRET
Value: whsec_your_actual_webhook_secret_here_from_stripe_dashboard
```

**Note:** Replace with your actual webhook secret from Stripe Dashboard

**Get from:** Stripe Dashboard → Webhooks → Your Webhook → Signing Secret  
**⚠️ Note:** Only available AFTER you create the webhook endpoint

---

#### 6. Email Configuration (Optional)

**Key:** `EMAIL_HOST`  
**Value:** `smtp.gmail.com`

**Real Example:**
```
Key:   EMAIL_HOST
Value: smtp.gmail.com
```

---

**Key:** `EMAIL_PORT`  
**Value:** `587`

**Real Example:**
```
Key:   EMAIL_PORT
Value: 587
```

---

**Key:** `EMAIL_USER`  
**Value:** `church@abunearegawi.org`

**Real Example:**
```
Key:   EMAIL_USER
Value: church@abunearegawi.org
```

---

**Key:** `EMAIL_PASS`  
**Value:** `abcd efgh ijkl mnop` (Gmail App Password - 16 characters)

**Real Example:**
```
Key:   EMAIL_PASS
Value: abcd efgh ijkl mnop
```

**⚠️ Note:** For Gmail, use App Password (not regular password)  
Get from: [Google Account → App Passwords](https://myaccount.google.com/apppasswords)

---

**Key:** `EMAIL_FROM_NAME`  
**Value:** `Abune Aregawi Church`

**Real Example:**
```
Key:   EMAIL_FROM_NAME
Value: Abune Aregawi Church
```

---

#### 7. Cloudinary Configuration (Required for Image/Video Uploads)

**Key:** `CLOUDINARY_CLOUD_NAME`  
**Value:** `your-cloud-name`

**Example Format:**
```
Key:   CLOUDINARY_CLOUD_NAME
Value: abunearegawi-church
```

**Note:** Get from [Cloudinary Dashboard](https://cloudinary.com/console) → Settings → Account Details

---

**Key:** `CLOUDINARY_API_KEY`  
**Value:** `123456789012345`

**Example Format:**
```
Key:   CLOUDINARY_API_KEY
Value: 123456789012345
```

**Note:** Get from [Cloudinary Dashboard](https://cloudinary.com/console) → Settings → API Keys

---

**Key:** `CLOUDINARY_API_SECRET`  
**Value:** `abcdefghijklmnopqrstuvwxyz123456`

**Example Format:**
```
Key:   CLOUDINARY_API_SECRET
Value: abcdefghijklmnopqrstuvwxyz123456
```

**Note:** Get from [Cloudinary Dashboard](https://cloudinary.com/console) → Settings → API Keys  
**⚠️ Important:** Keep this secret secure and never expose it publicly

**Get Cloudinary Credentials:**
1. Sign up at [cloudinary.com](https://cloudinary.com) (free tier available)
2. Go to Dashboard → Settings → Account Details
3. Copy your Cloud Name, API Key, and API Secret

---

## 🌐 Vercel (Frontend) Environment Variables

### Complete List with Example Values:

#### 1. Backend API URL

**Key:** `REACT_APP_API_URL`  
**Value:** `https://abunearegawi-backend.onrender.com/api`

**Real Example:**
```
Key:   REACT_APP_API_URL
Value: https://abunearegawi-backend.onrender.com/api
```

**Format:**
- Your Render backend URL + `/api`
- Example: `https://your-backend-name.onrender.com/api`
- Or custom domain: `https://api-church.yourdomain.com/api`

---

#### 2. Stripe Publishable Key

**Key:** `REACT_APP_STRIPE_PUBLISHABLE_KEY`  
**Value:** `pk_test_51...your_key_here...` (or `pk_live_...` for production)

**Example Format:**
```
Key:   REACT_APP_STRIPE_PUBLISHABLE_KEY
Value: pk_test_your_actual_publishable_key_here_from_stripe_dashboard
```

**Note:** Replace with your actual key from Stripe Dashboard (same as `STRIPE_PUBLISHABLE_KEY` in Render)

**⚠️ Important:** 
- Must match `STRIPE_PUBLISHABLE_KEY` in Render
- Must start with `REACT_APP_` for React to access it

---

## 📋 Copy-Paste Checklist

### Render (Backend) - Copy these into Render Dashboard:

```
Key: NODE_ENV
Value: production

Key: PORT
Value: 10000

Key: MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/church_db?retryWrites=true&w=majority

Key: JWT_SECRET
Value: your_32_character_random_string_here

Key: FRONTEND_URL
Value: https://your-vercel-url.vercel.app

Key: STRIPE_SECRET_KEY
Value: sk_test_...

Key: STRIPE_PUBLISHABLE_KEY
Value: pk_test_...

Key: STRIPE_WEBHOOK_SECRET
Value: whsec_...

Key: EMAIL_HOST
Value: smtp.gmail.com

Key: EMAIL_PORT
Value: 587

Key: EMAIL_USER
Value: your-email@gmail.com

Key: EMAIL_PASS
Value: your-app-password

Key: EMAIL_FROM_NAME
Value: Abune Aregawi Church

Key: CLOUDINARY_CLOUD_NAME
Value: your-cloudinary-cloud-name

Key: CLOUDINARY_API_KEY
Value: your-cloudinary-api-key

Key: CLOUDINARY_API_SECRET
Value: your-cloudinary-api-secret
```

---

### Vercel (Frontend) - Copy these into Vercel Dashboard:

```
Key: REACT_APP_API_URL
Value: https://your-backend-url.onrender.com/api

Key: REACT_APP_STRIPE_PUBLISHABLE_KEY
Value: pk_test_...
```

---

## 🔍 Visual Example in Dashboard

### Render Dashboard Format:

```
┌─────────────────────────────────────────┐
│ Environment Variables                   │
├─────────────────────────────────────────┤
│                                         │
│ Key: [NODE_ENV                    ]   │
│ Value: [production                ]   │
│                                         │
│ [Save Changes]                         │
│                                         │
└─────────────────────────────────────────┘
```

### Vercel Dashboard Format:

```
┌─────────────────────────────────────────┐
│ Add Environment Variable               │
├─────────────────────────────────────────┤
│                                         │
│ Key *                                   │
│ [REACT_APP_API_URL                  ]   │
│                                         │
│ Value *                                 │
│ [https://backend.onrender.com/api   ]   │
│                                         │
│ Environment                             │
│ ☑ Production                            │
│ ☑ Preview                                │
│ ☑ Development                            │
│                                         │
│ [Save] [Cancel]                        │
└─────────────────────────────────────────┘
```

---

## ⚠️ Important Notes

### Key Formatting:
- ✅ **Case-sensitive** - Use exact uppercase/lowercase
- ✅ **No spaces** before or after the key name
- ✅ **Use underscores** for multi-word keys (e.g., `REACT_APP_API_URL`)

### Value Formatting:
- ✅ **No quotes needed** - Don't add `"` or `'` around values
- ✅ **No spaces** at the beginning or end
- ✅ **Copy exact value** - Don't modify the string

### Common Mistakes:

**❌ Wrong:**
```
Key: react_app_api_url (lowercase)
Key: REACT_APP_API_URL (with trailing space)
Value: "https://api.com" (with quotes)
```

**✅ Correct:**
```
Key: REACT_APP_API_URL
Value: https://api.com
```

---

## 🎯 Quick Reference Table

| Platform | Variable | Example Key | Example Value |
|----------|----------|------------|---------------|
| **Render** | Node Environment | `NODE_ENV` | `production` |
| **Render** | Database | `MONGODB_URI` | `mongodb+srv://...` |
| **Render** | JWT Secret | `JWT_SECRET` | `a7f3d9e2b4c8f1...` |
| **Render** | Frontend URL | `FRONTEND_URL` | `https://app.vercel.app` |
| **Render** | Stripe Secret | `STRIPE_SECRET_KEY` | `sk_test_51...` |
| **Render** | Stripe Publishable | `STRIPE_PUBLISHABLE_KEY` | `pk_test_51...` |
| **Render** | Cloudinary Cloud Name | `CLOUDINARY_CLOUD_NAME` | `your-cloud-name` |
| **Render** | Cloudinary API Key | `CLOUDINARY_API_KEY` | `123456789012345` |
| **Render** | Cloudinary API Secret | `CLOUDINARY_API_SECRET` | `abcdefghijklmnop...` |
| **Vercel** | API URL | `REACT_APP_API_URL` | `https://api.onrender.com/api` |
| **Vercel** | Stripe Key | `REACT_APP_STRIPE_PUBLISHABLE_KEY` | `pk_test_51...` |

---

## ✅ Verification Checklist

After adding variables:

- [ ] Key names are exactly correct (case-sensitive)
- [ ] Values don't have extra spaces
- [ ] No quotes around values
- [ ] All required variables are added
- [ ] Service/project is redeployed after adding variables
- [ ] Check logs to verify variables are loaded

---

This format works for both Render and Vercel! Just replace the example values with your actual values. 🚀

