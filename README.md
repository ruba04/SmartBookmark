# Smart Bookmark App

A real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS. Features Google OAuth authentication and live synchronization across multiple tabs.

## Features

✅ Google OAuth authentication (no email/password)  
✅ Add bookmarks (URL + title)  
✅ Private bookmarks per user  
✅ Real-time updates without page refresh  
✅ Delete bookmarks  
✅ Deployed on Vercel  

## Tech Stack

- **Next.js 14** (App Router)
- **Supabase** (Auth, Database, Realtime)
- **Tailwind CSS** (Styling)
- **TypeScript**

## Prerequisites

Before you begin, you'll need:

1. A [Supabase](https://supabase.com) account 
2. A [Google Cloud Console](https://console.cloud.google.com) project for OAuth
3. A [Vercel](https://vercel.com) account for deployment

## Setup Instructions

### 1. Supabase Setup

#### Create a New Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to finish setting up
3. Go to **Settings** → **API** and copy:
   - `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
   - `anon public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

#### Create the Bookmarks Table

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Paste and run this SQL:

```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
```

#### Enable Realtime

1. Go to **Database** → **Replication**
2. Find the `bookmarks` table
3. Enable replication for it

### 2. Google OAuth Setup

#### Create OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select an existing one)
3. Enable the **Google+ API**:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API"
   - Click **Enable**
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **OAuth client ID**
6. Configure the consent screen if prompted
7. Choose **Web application**
8. Add authorized redirect URIs:
   - `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback`
   - (Find your project ID in Supabase Settings → API → Project URL)
9. Copy the **Client ID** and **Client Secret**

#### Configure Google OAuth in Supabase

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** and enable it
3. Paste your **Client ID** and **Client Secret**
4. Add your site URL:
   - For development: `http://localhost:3000`
   - For production: `https://your-app.vercel.app`
5. Save the configuration

### 3. Local Development Setup

#### Clone and Install

```bash
# Clone your repository
git clone <your-repo-url>
cd smart-bookmark-app

# Install dependencies
npm install
```

#### Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with your actual Supabase credentials from Step 1.

#### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Deploy to Vercel

#### One-Click Deploy

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click **Import Project**
4. Select your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click **Deploy**

#### Update Google OAuth Redirect URI

After deployment:

1. Copy your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
2. Go back to **Supabase** → **Authentication** → **Providers** → **Google**
3. Add the Vercel URL to **Site URL**
4. Go to **Google Cloud Console** → **Credentials**
5. Edit your OAuth client
6. Add to authorized redirect URIs:
   - `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback`

## Usage

1. **Sign In**: Click "Sign in with Google"
2. **Add Bookmark**: Enter a title and URL, then click "Add Bookmark"
3. **Delete Bookmark**: Click the trash icon next to any bookmark
4. **Real-time Sync**: Open the app in multiple tabs - changes appear instantly everywhere!

## Troubleshooting

### Authentication Issues

- Make sure your Google OAuth credentials are correctly configured
- Check that redirect URIs match exactly (including https://)
- Verify that Google+ API is enabled in Google Cloud Console

### Realtime Not Working

- Ensure replication is enabled for the `bookmarks` table in Supabase
- Check browser console for WebSocket connection errors
- Verify your Supabase project has realtime enabled

### Deployment Issues

- Double-check environment variables in Vercel
- Ensure all Supabase redirect URIs include your Vercel domain
- Check Vercel deployment logs for specific errors

## Project Structure

```
smart-bookmark-app/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page with auth & bookmarks
├── lib/
│   └── supabase.ts           # Supabase client setup
├── .env                      # Environment variables template
├── next.config.js            # Next.js configuration
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind configuration
└── tsconfig.json             # TypeScript configuration
```
## Live

-This project is live at https://smart-bookmark-irdc.vercel.app do check it out !!

##  Challenges & Key Learnings

During development, I encountered several real-world challenges that strengthened my full-stack skills:

- **Google OAuth Integration:**  
  Faced redirect URI mismatches and authentication errors. Resolved by properly configuring OAuth credentials in Google Cloud Console and Supabase, ensuring exact URL matching for both development and production.

- **Row Level Security (RLS):**  
  Initial data access issues were caused by restrictive RLS policies. Solved by implementing precise policies using `auth.uid()` and thoroughly testing queries in the SQL editor.

- **Real-Time Synchronization:**  
  Live updates were not triggering across tabs due to missing replication and improper subscription handling. Fixed by enabling Supabase replication and implementing proper React `useEffect` cleanup for subscriptions.

- **Next.js App Router Architecture:**  
  Encountered client/server component conflicts. Addressed by clearly separating Client Components (`"use client"`) and organizing Supabase logic in a dedicated utility file.

- **Production Deployment Issues:**  
  The app worked locally but failed in production due to missing environment variables. Resolved by correctly configuring Vercel environment variables and redeploying.

---

###  What This Project Demonstrates

- Secure authentication with OAuth
- Database security using Row Level Security (RLS)
- Real-time data synchronization
- Modern Next.js 14 App Router architecture
- Full-stack debugging and production deployment

This project reflects my ability to build secure, real-time, production-ready applications while effectively solving practical development challenges.

