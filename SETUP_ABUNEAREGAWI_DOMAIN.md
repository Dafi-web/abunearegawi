# Setup Guide: abunearegawi.nl Domain

## Your Domain Information

- **Domain:** `abunearegawi.nl`
- **Current Nameservers:** `ns1.dns-parking.com`, `ns2.dns-parking.com` (parked)
- **Status:** Active until 2026-11-01

---

## ⚠️ Important: DNS-Parking.com is a Parking Service

DNS-Parking.com is typically a domain parking service, which means you can't add custom DNS records there. You'll need to **change nameservers** to use your domain.

---

## Step 1: Add Domain to Vercel

### In Vercel Dashboard:

1. Go to **Vercel Dashboard** → `tigrayans-church` project
2. Click **"Settings"** tab
3. Click **"Domains"** (left sidebar)
4. Click **"Add Domain"** button
5. Enter: `abunearegawi.nl`
6. Click **"Add"**

Vercel will show you DNS configuration. You'll see something like:

**Option 1 (A Record):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Option 2 (CNAME):**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

**Note:** Write down these instructions - you'll need them in the next step.

---

## Step 2: Change Nameservers (Required)

Since DNS-Parking.com doesn't allow custom DNS records, you need to change nameservers to a service that does.

### Recommended Options:

#### Option A: Use Your Domain Registrar's DNS (Easiest)

1. **Log in to your domain registrar** (where you bought `abunearegawi.nl`)
2. Go to **DNS Management** or **Nameserver Settings**
3. Change nameservers from:
   ```
   ns1.dns-parking.com
   ns2.dns-parking.com
   ```
   
   To your registrar's default nameservers (they'll provide these)

4. **Access DNS Management** from your registrar
5. Add DNS records (see Step 3)

---

#### Option B: Use Cloudflare (Free, Recommended)

1. **Sign up at [Cloudflare](https://cloudflare.com)** (free)
2. **Add Site** → Enter `abunearegawi.nl`
3. **Select Plan:** Free
4. Cloudflare will scan your existing DNS (skip this, you'll add new)
5. **Cloudflare will show you new nameservers:**
   ```
   ns1.cloudflare.com
   ns2.cloudflare.com
   ```
   (Or similar)

6. **Go back to your domain registrar**
7. **Change nameservers** to Cloudflare's nameservers
8. Wait 24-48 hours for DNS propagation

9. **In Cloudflare Dashboard:**
   - Go to **DNS** → **Records**
   - Delete any parking records
   - Add new records (see Step 3)

---

#### Option C: Use Vercel's Nameservers (If Available)

Some registrars allow you to point directly to Vercel. Check your registrar's documentation.

---

## Step 3: Add DNS Records

After changing nameservers, add these DNS records:

### In Your DNS Provider (Cloudflare, Registrar, etc.):

**For main domain (abunearegawi.nl):**

**Option 1 - Using A Record:**
```
Type: A
Name: @ (or leave blank)
Value: 76.76.21.21
TTL: Auto (or 3600)
Proxy: Off (in Cloudflare)
```

**Option 2 - Using CNAME:**
```
Type: CNAME
Name: @ (or blank)
Value: cname.vercel-dns.com
TTL: Auto (or 3600)
Proxy: Off
```

**For www subdomain (optional):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto (or 3600)
Proxy: Off
```

**Note:** Use the exact values Vercel provided in Step 1.

---

## Step 4: Update Environment Variables

### In Render Dashboard (Backend):

1. Go to **Render Dashboard** → Your backend service
2. **Settings** → **Environment**
3. Find or add **`FRONTEND_URL`**
4. Update to:
   ```
   FRONTEND_URL = https://abunearegawi.nl
   ```
5. **Save Changes** (auto-redeploys)

---

### In Vercel Dashboard (Frontend):

Your `REACT_APP_API_URL` can stay as is:
```
REACT_APP_API_URL = https://abunearegawi.onrender.com/api
```

Or if you want to add a backend subdomain later:
```
REACT_APP_API_URL = https://api.abunearegawi.nl/api
```

---

## Step 5: Wait for DNS Propagation

- **Nameserver changes:** 24-48 hours
- **DNS record updates:** 5-60 minutes
- **Vercel domain verification:** Usually instant after DNS propagates

---

## Step 6: Verify Setup

1. **Check DNS propagation:**
   - Visit: [whatsmydns.net](https://www.whatsmydns.net)
   - Enter: `abunearegawi.nl`
   - Check if A/CNAME records match Vercel's values

2. **In Vercel Dashboard:**
   - Go to **Settings** → **Domains**
   - Check if `abunearegawi.nl` shows as **"Valid"** or **"Configured"**

3. **Test your site:**
   - Visit: `https://abunearegawi.nl`
   - Should load your Vercel site!

---

## Troubleshooting

### If DNS doesn't update:

1. **Wait longer** (up to 48 hours for nameserver changes)
2. **Check nameservers** are correctly set at registrar
3. **Clear DNS cache:**
   ```bash
   # On Mac/Linux:
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder
   
   # On Windows:
   ipconfig /flushdns
   ```

### If Vercel shows "Invalid Configuration":

1. **Verify DNS records** are correct
2. **Check TTL** - should be Auto or 3600
3. **Wait for propagation** (can take time)
4. **Re-check** values match exactly what Vercel shows

---

## Quick Checklist

- [ ] Add `abunearegawi.nl` in Vercel Dashboard → Settings → Domains
- [ ] Note down DNS values Vercel provides
- [ ] Change nameservers from DNS-Parking to Cloudflare/Registrar
- [ ] Wait for nameserver propagation (24-48 hours)
- [ ] Add DNS records (A or CNAME) in new DNS provider
- [ ] Update `FRONTEND_URL` in Render = `https://abunearegawi.nl`
- [ ] Wait for DNS propagation (5-60 minutes)
- [ ] Verify in Vercel Dashboard that domain is valid
- [ ] Test: Visit `https://abunearegawi.nl`

---

## Recommended: Cloudflare Setup

**Why Cloudflare:**
- ✅ Free
- ✅ Fast DNS
- ✅ Easy DNS management
- ✅ CDN and security features
- ✅ Works great with Vercel

**Quick Cloudflare Steps:**

1. Sign up at cloudflare.com (free)
2. Add site: `abunearegawi.nl`
3. Choose Free plan
4. Get Cloudflare nameservers
5. Update nameservers at your registrar
6. Wait for propagation
7. Add DNS records in Cloudflare
8. Done!

---

## Summary

1. **Add domain to Vercel** → Get DNS instructions
2. **Change nameservers** from DNS-Parking to Cloudflare/Registrar
3. **Add DNS records** in new DNS provider
4. **Update `FRONTEND_URL`** in Render
5. **Wait and test!**

Your site will be live at `https://abunearegawi.nl`! 🚀

---

## Need Help?

If you get stuck at any step, let me know:
- Which registrar you're using (for changing nameservers)
- Any error messages from Vercel or DNS provider
- What step you're currently on

I can provide more specific guidance!

