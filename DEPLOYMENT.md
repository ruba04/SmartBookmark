# Vercel Deployment Guide

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fsmart-bookmark-app)

## Manual Deployment Steps

### 1. Prepare Your Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create a new repository on GitHub and push
git remote add origin https://github.com/your-username/smart-bookmark-app.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New Project**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3. Add Environment Variables

In the Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Deploy

Click **Deploy** and wait for the build to complete.

### 5. Update Supabase Configuration

After deployment, copy your Vercel URL (e.g., `https://smart-bookmark-app.vercel.app`)

#### Update Supabase Auth Settings

1. Go to your Supabase dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Vercel URL to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: `https://your-app.vercel.app/**`

#### Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs**:
   - `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback`
5. Add to **Authorized JavaScript origins**:
   - `https://your-app.vercel.app`

### 6. Test Your Deployment

1. Visit your Vercel URL
2. Try signing in with Google
3. Add a bookmark
4. Open the app in another tab to verify real-time sync

## Custom Domain (Optional)

### Add a Custom Domain

1. In Vercel project settings, go to **Domains**
2. Add your custom domain (e.g., `bookmarks.yourdomain.com`)
3. Follow the DNS configuration instructions
4. Update Supabase and Google OAuth settings with the custom domain

## Environment-Specific Settings

### Development
- URL: `http://localhost:3000`
- Uses `.env.local`

### Production
- URL: Your Vercel deployment URL
- Uses Vercel environment variables

## Troubleshooting

### Build Fails

Check the Vercel build logs for errors. Common issues:
- Missing environment variables
- TypeScript errors
- Dependency issues

### Authentication Not Working

1. Verify environment variables are set correctly in Vercel
2. Check Supabase redirect URLs include your Vercel domain
3. Ensure Google OAuth redirect URIs are properly configured
4. Check browser console for errors

### Real-time Not Syncing

1. Verify Supabase Realtime is enabled for the `bookmarks` table
2. Check browser console for WebSocket errors
3. Ensure Row Level Security policies are correct

## Continuous Deployment

Vercel automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

The app will automatically redeploy on Vercel.

## Monitoring

### View Logs

In your Vercel dashboard:
1. Go to your project
2. Click **Deployments**
3. Select a deployment
4. View **Runtime Logs**

### Analytics

Enable Vercel Analytics:
1. Go to **Analytics** in your project
2. Click **Enable**
3. View traffic and performance metrics

## Rollback

To rollback to a previous deployment:
1. Go to **Deployments** in Vercel
2. Find the working deployment
3. Click the three dots menu
4. Select **Promote to Production**

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
