# Fix: React 19 Dependency Conflict in Vercel

## Problem

You're getting this error in Vercel:
```
npm error ERESOLVE could not resolve
npm error peer react@"^16.8.0 || ^17.0.0 || ^18.0.0" from @stripe/react-stripe-js@2.9.0
```

**Cause:** React 19 is newer than what `@stripe/react-stripe-js` officially supports, but it actually works fine.

## Solution

I've updated `client/vercel.json` to use `--legacy-peer-deps` flag.

**Updated Install Command:**
```json
"installCommand": "npm install --legacy-peer-deps"
```

---

## If You Want to Set It in Vercel Dashboard:

1. Go to **Vercel Dashboard** → Your Project
2. Click **"Settings"** tab
3. Click **"General"** (left sidebar)
4. Scroll to **"Build & Development Settings"**
5. Find **"Install Command"**
6. Change to: `npm install --legacy-peer-deps`
7. Click **"Save"**
8. **Redeploy** your project

---

## Alternative Solutions (If Above Doesn't Work)

### Option 1: Downgrade React to 18.x

Update `client/package.json`:

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

Then run:
```bash
cd client
npm install
git add package.json package-lock.json
git commit -m "Downgrade React to 18.x for compatibility"
git push
```

### Option 2: Add .npmrc file

Create `client/.npmrc` file:

```
legacy-peer-deps=true
```

This will use `--legacy-peer-deps` by default.

---

## What --legacy-peer-deps Does

- Ignores peer dependency conflicts
- Installs packages even if peer dependencies don't match exactly
- Safe to use when you know the packages are compatible (React 19 works with Stripe)

---

## Verification

After updating:

1. ✅ Save settings in Vercel
2. ✅ Redeploy project
3. ✅ Check build logs - should complete successfully
4. ✅ Test deployed site

The build should now succeed! 🎉

