# Vercel Deployment Guide for ZKWhisper

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. GitHub repository connected to Vercel
3. Supabase project set up
4. Environment variables ready

## Deployment Steps

### 1. Connect Repository to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository: `tmanas06/ZKWhisper`
3. Vercel will auto-detect Next.js

### 2. Configure Project Settings

**Root Directory:** Since your Next.js app is in the `app` folder, you need to set:
- **Root Directory:** `app`
- **Framework Preset:** Next.js
- **Build Command:** `yarn build` (or `npm run build`)
- **Output Directory:** `.next` (default)
- **Install Command:** `yarn install` (or `npm install`)

### 3. Set Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

#### Required Variables:
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key
```

#### Optional Variables:
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_MICROSOFT_CLIENT_ID=your-microsoft-client-id
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
TWITTER_ACCESS_TOKEN=your-twitter-access-token
TWITTER_ACCESS_TOKEN_SECRET=your-twitter-access-token-secret
```

**Important:**
- Set these for **Production**, **Preview**, and **Development** environments
- Never commit these to Git - they're already in `.gitignore`

### 4. Update OAuth Redirect URIs

After deployment, update your OAuth redirect URIs:

#### Google OAuth:
1. Go to https://console.cloud.google.com/apis/credentials
2. Edit your OAuth 2.0 Client
3. Add authorized redirect URI:
   - `https://your-app.vercel.app/oauth-callback/google`
   - `https://your-app.vercel.app/api/auth/callback/google` (if needed)

#### Microsoft OAuth:
1. Go to https://portal.azure.com/
2. Navigate to your app registration
3. Add redirect URI:
   - `https://your-app.vercel.app/oauth-callback/microsoft`

### 5. Deploy

1. Click **"Deploy"** in Vercel
2. Wait for build to complete
3. Your app will be live at `https://your-app.vercel.app`

### 6. Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Build Configuration

The project uses:
- **Node.js:** 18.x or 20.x (Vercel auto-detects)
- **Package Manager:** Yarn (specified in `package.json`)
- **WebAssembly:** Enabled for ZK circuits
- **Build Timeout:** 30 seconds (configured in `vercel.json`)

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify `app/package.json` has correct dependencies
- Check build logs in Vercel dashboard

### API Routes Not Working
- Ensure environment variables are set for the correct environment
- Check function timeout settings (max 30s for Hobby plan)

### WebAssembly Issues
- Vercel supports WebAssembly by default
- If issues occur, check `next.config.mjs` webpack configuration

## Post-Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] OAuth redirect URIs updated
- [ ] Supabase database accessible from Vercel
- [ ] Test authentication flow
- [ ] Test message posting
- [ ] Verify WebAssembly circuits load correctly

## Quick Deploy via CLI

Alternatively, you can deploy using Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (from project root)
cd app
vercel

# Follow prompts to link project
```

