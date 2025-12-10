# Cloudinary Setup Guide

## Quick Setup

Your application requires Cloudinary credentials for image and video uploads. Follow these steps:

## Step 1: Get Cloudinary Account (Free)

1. Go to [cloudinary.com](https://cloudinary.com/users/register/free)
2. Sign up for a free account (no credit card required)
3. After signing up, you'll be taken to your Dashboard

## Step 2: Get Your Credentials

1. In the Cloudinary Dashboard, go to **Settings** (gear icon) → **Account Details**
2. You'll see three important values:
   - **Cloud Name** (e.g., `dxy8abc12`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

## Step 3: Add to Environment Variables

### For Local Development

Create or edit `server/.env` file and add:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Example:**
```env
CLOUDINARY_CLOUD_NAME=dxy8abc12
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

### For Production (Render)

1. Go to **Render Dashboard** → Your Service → **Settings** → **Environment**
2. Add these three variables:

```
Key: CLOUDINARY_CLOUD_NAME
Value: your_cloud_name_here

Key: CLOUDINARY_API_KEY
Value: your_api_key_here

Key: CLOUDINARY_API_SECRET
Value: your_api_secret_here
```

3. Click **Save Changes**
4. **Redeploy** your service for changes to take effect

## Step 4: Verify Setup

After adding the credentials:

1. **Restart your server** (if running locally)
2. Try uploading an image or video through your admin panel
3. The upload should now work successfully

## Troubleshooting

### Error: "Cloudinary is not fully configured"

This means one or more of the three Cloudinary variables are missing:

- ✅ Check that all three variables are set: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- ✅ Make sure there are no typos in the variable names
- ✅ Ensure values don't have extra spaces or quotes
- ✅ For production, redeploy after adding variables

### Error: "Invalid API credentials"

- ✅ Double-check you copied the correct values from Cloudinary Dashboard
- ✅ Make sure you're using the API Secret (not the API Key) for `CLOUDINARY_API_SECRET`
- ✅ Verify your Cloudinary account is active

## Security Notes

⚠️ **Important:**
- Never commit `.env` files to Git (they're already in `.gitignore`)
- Never share your API Secret publicly
- The API Secret is sensitive - treat it like a password
- If you accidentally expose it, regenerate it in Cloudinary Dashboard

## Free Tier Limits

Cloudinary's free tier includes:
- 25 GB storage
- 25 GB monthly bandwidth
- 25,000 monthly transformations

This is usually sufficient for small to medium applications.

---

**Need help?** Check the Cloudinary documentation: https://cloudinary.com/documentation

