# Vercel Install Command Configuration Guide

This guide explains how to set up the Install Command in Vercel for your React frontend.

---

## 📋 Install Command for Your Project

### For React Apps with npm:

**Install Command:** `npm install`

**Alternative (faster for production):**
`npm ci` (uses package-lock.json, faster and more reliable)

---

## 🔧 How to Set It in Vercel Dashboard

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Navigate to [vercel.com/dashboard](https://vercel.com/dashboard)

2. **Select Your Project**
   - Click on your project (e.g., `abunearegawi-church`)

3. **Go to Settings**
   - Click on **"Settings"** tab (top navigation)

4. **Go to General**
   - In left sidebar, click **"General"**
   - Scroll down to **"Build & Development Settings"**

5. **Configure Build Settings**
   - Find **"Install Command"** field
   - Enter: `npm install` or `npm ci`
   - Click **"Save"**

### Visual Guide:

```
Vercel Dashboard
  └── Your Project
      └── Settings Tab
          └── General (left sidebar)
              └── Build & Development Settings
                  ├── Framework Preset: Other
                  ├── Root Directory: client
                  ├── Install Command: npm install
                  ├── Build Command: npm run build
                  └── Output Directory: build
```

---

## 📝 Complete Build Settings for Vercel

### Recommended Configuration:

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Other` |
| **Root Directory** | `client` |
| **Install Command** | `npm install --legacy-peer-deps` |
| **Build Command** | `npm run build` |
| **Output Directory** | `build` |
| **Development Command** | `npm start` (optional, for preview) |

---

## 🎯 Install Command Options

### Option 1: npm install (Recommended)
```
npm install
```
- ✅ Installs all dependencies from package.json
- ✅ Works with or without package-lock.json
- ✅ Good for general use

### Option 2: npm ci (Faster for Production)
```
npm ci
```
- ✅ Faster installation
- ✅ Uses exact versions from package-lock.json
- ✅ Cleans node_modules before installing
- ⚠️ Requires package-lock.json to exist
- ⚠️ Will fail if package.json and package-lock.json are out of sync

### Option 3: npm install --production (Don't Use)
```
npm install --production
```
- ❌ Won't work - React needs dev dependencies to build

---

## ✅ If You Want to Use `npm ci`:

**First, make sure package-lock.json exists:**

1. In your project root (`client` directory), run:
   ```bash
   cd client
   npm install
   ```
   This creates/updates `package-lock.json`

2. Commit it to GitHub:
   ```bash
   git add client/package-lock.json
   git commit -m "Add package-lock.json"
   git push
   ```

3. Then use `npm ci` in Vercel:
   - Install Command: `npm ci`

---

## 🔍 Auto-Detection by Vercel

**Good News:** Vercel automatically detects npm/yarn/pnpm!

If you **don't specify** an install command:
- Vercel will **automatically** run `npm install` if it detects `package.json`
- This works for most React apps

**So you can either:**
- ✅ Leave it empty (Vercel auto-detects)
- ✅ Explicitly set `npm install` (more clear)

---

## 📋 Step-by-Step Setup in Vercel

### When Creating New Project:

1. **Import Repository**
   - Connect GitHub repo
   - Select your repository

2. **Configure Project**
   - **Framework Preset:** `Other` (or leave blank)
   - **Root Directory:** `client`
   - **Install Command:** `npm install` (or leave blank for auto-detect)
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

3. **Click "Deploy"**

### For Existing Project:

1. **Go to Settings → General**
2. **Scroll to "Build & Development Settings"**
3. **Update Install Command:**
   - Change to: `npm install`
   - Or: `npm ci` (if you have package-lock.json)
4. **Click "Save"**
5. **Redeploy** your project

---

## 🛠️ Troubleshooting

### Build Fails with "Install Command Failed"

**Possible Causes:**
- ❌ Wrong directory (should be in `client` folder)
- ❌ Node version incompatible
- ❌ Package.json has errors
- ❌ Network issues during install

**Solutions:**
1. ✅ Check Root Directory is set to `client`
2. ✅ Verify `package.json` is valid JSON
3. ✅ Check Vercel build logs for specific errors
4. ✅ Try using `npm ci` instead of `npm install`

### Dependencies Not Installing

**Check:**
1. ✅ Root Directory is correct (`client`)
2. ✅ `package.json` exists in `client` folder
3. ✅ Install Command is set correctly
4. ✅ Check build logs for npm errors

### Using Wrong Node Version

**Fix:**
1. Go to Settings → General
2. Find **"Node.js Version"**
3. Set to `18.x` or `20.x` (recommended for React)
4. Save and redeploy

---

## 💡 Best Practices

1. **Always commit `package-lock.json`** to Git
   - Ensures consistent installs
   - Allows using `npm ci` (faster)

2. **Use Root Directory correctly**
   - Set to `client` (not root of repo)

3. **Monitor build logs**
   - Check if install completes successfully
   - Look for warnings/errors

4. **Keep dependencies updated**
   - Run `npm update` regularly
   - Commit updated `package-lock.json`

---

## 📊 Summary

### Recommended Settings:

```
Root Directory: client
Install Command: npm install (or leave blank)
Build Command: npm run build
Output Directory: build
```

### Quick Checklist:

- [ ] Root Directory set to `client`
- [ ] Install Command: `npm install` (or auto-detect)
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `build`
- [ ] Environment Variables set (REACT_APP_API_URL, etc.)

---

## 🚀 Next Steps

After setting install command:

1. ✅ Save settings
2. ✅ Redeploy project
3. ✅ Check build logs to verify install succeeds
4. ✅ Test deployed site

Your install command is now configured! 🎉

