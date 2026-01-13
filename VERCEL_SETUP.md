# Vercel Environment Variables Setup

## Overview
This guide walks you through adding your Supabase credentials to Vercel so the production app can access the database.

## Steps

### 1. Go to Vercel Project Settings
1. Visit [vercel.com/dashboard](https://vercel.com/dashboard)
2. Find your project: **mp-hybrid-stationary**
3. Click on the project name
4. Go to **Settings** tab (top navigation)

### 2. Navigate to Environment Variables
1. In the left sidebar, click **Environment Variables**
2. You'll see an empty form to add new variables

### 3. Add Supabase Credentials

Add these three environment variables (one at a time):

#### Variable 1: NEXT_PUBLIC_SUPABASE_URL
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** Your Supabase Project URL
  - Find this in Supabase Dashboard → Project Settings → API → Project URL
  - Should look like: `https://xxxxxxxxxxxx.supabase.co`
- **Environment(s):** Select all (Production, Preview, Development)
- Click **Save**

#### Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** Your Supabase Anonymous Key
  - Find this in Supabase Dashboard → Project Settings → API → anon (public)
  - Long string starting with `eyJ...`
- **Environment(s):** Select all (Production, Preview, Development)
- Click **Save**

#### Variable 3 (Optional for Backend): SUPABASE_SERVICE_ROLE_KEY
- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** Your Supabase Service Role Key
  - Find this in Supabase Dashboard → Project Settings → API → service_role (secret)
  - Only needed if you build API routes that modify data
- **Environment(s):** Production only (for security)
- Click **Save**

### 4. Redeploy Your Project
After adding environment variables:
1. Go to **Deployments** tab
2. Find the most recent deployment
3. Click the three dots (**...**) → **Redeploy**
4. Wait for deployment to complete (shows "Ready")

### 5. Test the Connection
1. Visit your live app: [mp-hybrid-stationary.vercel.app](https://mp-hybrid-stationary.vercel.app)
2. Go to `/invite?event=test-event`
3. Check the browser console (F12 → Console) for errors
4. Should see either:
   - ✅ Loaded data from Supabase (if event exists)
   - ✅ Loaded fallback hardcoded data (if event doesn't exist)

## Troubleshooting

### "Connection refused" or "Network error"
- Verify NEXT_PUBLIC_SUPABASE_URL is correct (without trailing slash)
- Check that the URL is accessible in your browser directly
- Make sure credentials were pasted fully without extra spaces

### "403 Forbidden" or "Unauthorized"
- Verify NEXT_PUBLIC_SUPABASE_ANON_KEY is correct
- Check that RLS policies aren't too restrictive (see SUPABASE_SETUP.md)

### Still seeing hardcoded wedding data
- This is expected! The app falls back to hardcoded config if no database event found
- To test with real data, create a sample invitation in Supabase (see next section)

## Create Sample Test Data

Once environment variables are set up, create a test invitation:

### 1. Go to Supabase Dashboard
- Visit [app.supabase.com](https://app.supabase.com)
- Select your project

### 2. Create Test Planner
- Go to **SQL Editor**
- Run this query:
```sql
INSERT INTO planners (email, name) 
VALUES ('test@planners.com', 'Test Planner');
```

### 3. Create Test Invitation
- Run this query:
```sql
INSERT INTO invitations (
  event_slug,
  planner_email,
  couple_name_1,
  couple_name_2,
  event_date,
  venue_name,
  venue_address,
  show_weather,
  show_area_facts,
  show_contacts
) VALUES (
  'test-event',
  'test@planners.com',
  'Sarah',
  'John',
  '2024-06-15',
  'The Grand Ballroom',
  'Downtown, City, State',
  true,
  true,
  true
);
```

### 4. Test the App
- Visit: `https://mp-hybrid-stationary.vercel.app/invite?event=test-event`
- Should see your custom invitation!

## Environment Variables Reference

| Variable | Visibility | Required | Purpose |
|----------|-----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public (in browser) | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (in browser) | Yes | Read-only database access |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Optional | Full database access (if building API routes) |

**Note:** Variables starting with `NEXT_PUBLIC_` are exposed to the browser and are safe to be public. Never expose the service role key in browser code!

## Next Steps

After environment variables are working:
1. ✅ Test with sample data (above)
2. ⏳ Set up RLS (Row Level Security) policies in Supabase
3. ⏳ Build admin dashboard for planners to customize invitations
4. ⏳ Enable image uploads to Supabase Storage

See SUPABASE_SETUP.md for RLS policy implementation.
