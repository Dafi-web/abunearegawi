# Fix: Cloudinary Not Working on Render (Production)

## The Problem

Your server is deployed on **Render**, and the Cloudinary environment variables are **not set** in the Render dashboard. The `.env` file only works for local development - production uses environment variables set in the Render dashboard.

## The Solution

### Step 1: Go to Render Dashboard

1. Go to [render.com](https://render.com) and log in
2. Click on your service: **abunearegawi-backend**
3. Go to **Settings** → **Environment**

### Step 2: Add Cloudinary Variables

Add these **three** environment variables:

```
Key: CLOUDINARY_CLOUD_NAME
Value: dcmwonevb
```

```
Key: CLOUDINARY_API_KEY
Value: 962794492474534
```

```
Key: CLOUDINARY_API_SECRET
Value: e6HkOJBge6axVu9TBJUD60hdENA
```

### Step 3: Save and Redeploy

1. Click **Save Changes** after adding each variable
2. Render will automatically redeploy your service
3. Wait for the deployment to complete (usually 2-3 minutes)

### Step 4: Verify

After deployment completes:
1. Try uploading an image through your admin panel
2. It should now work! ✅

## Why This Happened

- Last week: The variables were probably set in Render
- Today: They might have been removed, or the service was redeployed without them
- The `.env` file only works locally, not in production

## Quick Checklist

- [ ] Go to Render Dashboard
- [ ] Navigate to your service → Settings → Environment
- [ ] Add `CLOUDINARY_CLOUD_NAME` = `dcmwonevb`
- [ ] Add `CLOUDINARY_API_KEY` = `962794492474534`
- [ ] Add `CLOUDINARY_API_SECRET` = `e6HkOJBge6axVu9TBJUD60hdENA`
- [ ] Save changes
- [ ] Wait for redeploy
- [ ] Test image upload

---

**Note:** I've also updated `render.yaml` to include these variables in the configuration file, but you still need to set the actual values in the Render dashboard.

