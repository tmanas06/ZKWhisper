# Quick Vercel Deployment Guide

## Step-by-Step Deployment

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy on Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel**: https://vercel.com/new
2. **Import Git Repository**: 
   - Click "Import Git Repository"
   - Select `tmanas06/ZKWhisper`
   - Click "Import"

3. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `app` ⚠️ **IMPORTANT: Set this to `app`**
   - **Build Command**: `yarn build` (or leave default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `yarn install` (or leave default)

4. **Environment Variables**:
   Click "Environment Variables" and add:
   
   **Required:**
   - `SUPABASE_URL` = `https://your-project-id.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-key`
   
   **Optional:**
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` = `your-google-client-id`
   - `NEXT_PUBLIC_MICROSOFT_CLIENT_ID` = `your-microsoft-client-id`
   - `TWITTER_API_KEY` = `your-twitter-key`
   - `TWITTER_API_SECRET` = `your-twitter-secret`
   - `TWITTER_ACCESS_TOKEN` = `your-access-token`
   - `TWITTER_ACCESS_TOKEN_SECRET` = `your-token-secret`

   **⚠️ Important:** Set these for **Production**, **Preview**, and **Development**

5. **Deploy**: Click "Deploy" button

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to app directory
cd app

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No (first time) or Yes (if exists)
# - Project name? zkwhisper (or your choice)
# - Directory? . (current directory)
# - Override settings? No

# For production deployment
vercel --prod
```

### 3. Update OAuth Redirect URIs

After deployment, you'll get a URL like `https://zkwhisper.vercel.app`

**Update Google OAuth:**
1. Go to https://console.cloud.google.com/apis/credentials
2. Edit your OAuth 2.0 Client
3. Add to Authorized redirect URIs:
   - `https://your-app.vercel.app/oauth-callback/google`

**Update Microsoft OAuth:**
1. Go to https://portal.azure.com/
2. Navigate to App registrations → Your app
3. Add redirect URI:
   - `https://your-app.vercel.app/oauth-callback/microsoft`

### 4. Verify Deployment

1. Visit your Vercel URL
2. Test authentication
3. Test message posting
4. Check browser console for errors

## Troubleshooting

### Build Fails
- ✅ Check Root Directory is set to `app`
- ✅ Verify all environment variables are set
- ✅ Check build logs in Vercel dashboard

### API Routes Return 500
- ✅ Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- ✅ Check Supabase project is active
- ✅ Verify database tables exist (run `schema.sql`)

### OAuth Not Working
- ✅ Update redirect URIs with your Vercel URL
- ✅ Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set
- ✅ Check OAuth credentials in Google Cloud Console

### WebAssembly Issues
- ✅ Vercel supports WebAssembly by default
- ✅ Check `next.config.mjs` webpack config
- ✅ Verify `@aztec/bb.js` is in dependencies

## Post-Deployment Checklist

- [ ] Root Directory set to `app` in Vercel
- [ ] All environment variables configured
- [ ] OAuth redirect URIs updated
- [ ] Supabase database accessible
- [ ] Test authentication flow
- [ ] Test message posting
- [ ] Verify WebAssembly loads
- [ ] Check mobile responsiveness

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update OAuth redirect URIs with new domain

