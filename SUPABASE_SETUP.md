# Supabase Setup Complete Checklist

## ✅ Completed Setup Steps

### Database Schema (Created)
- ✅ planners table
- ✅ invitations table  
- ✅ invitation_edit_history table
- ✅ invitation_assets table

All tables created with proper relationships and indexes.

## 🔧 Next: Row Level Security (RLS) Policies

RLS policies restrict data access based on user identity. This ensures:
- Planners can only see their own invitations
- Planners can only modify their own invitations
- Public users can view published invitations

### Enable RLS on Tables

Go to Supabase Dashboard → SQL Editor and run:

```sql
-- Enable RLS on all tables
ALTER TABLE planners ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_edit_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_assets ENABLE ROW LEVEL SECURITY;
```

### Create RLS Policies

#### Planners Table - Allow Self Access

```sql
-- Planners can see their own profile
CREATE POLICY "planners_select_self" ON planners
  FOR SELECT USING (auth.email() = email);

-- Planners can update their own profile  
CREATE POLICY "planners_update_self" ON planners
  FOR UPDATE USING (auth.email() = email)
  WITH CHECK (auth.email() = email);
```

#### Invitations Table - Planner Access

```sql
-- Planners can view their own invitations
CREATE POLICY "invitations_select_own" ON invitations
  FOR SELECT USING (planner_email = auth.email());

-- Planners can insert new invitations
CREATE POLICY "invitations_insert_own" ON invitations
  FOR INSERT WITH CHECK (planner_email = auth.email());

-- Planners can update their own invitations
CREATE POLICY "invitations_update_own" ON invitations
  FOR UPDATE USING (planner_email = auth.email())
  WITH CHECK (planner_email = auth.email());

-- Planners can delete their own invitations
CREATE POLICY "invitations_delete_own" ON invitations
  FOR DELETE USING (planner_email = auth.email());
```

#### Invitations Table - Public View (For Shared Links)

```sql
-- Anyone can view published invitations (optional)
-- Only if you want to share invite links publicly
CREATE POLICY "invitations_select_published" ON invitations
  FOR SELECT USING (is_published = true);
```

#### Invitation Edit History - Planner Access

```sql
-- Planners can view history of their invitations
CREATE POLICY "history_select_own" ON invitation_edit_history
  FOR SELECT USING (
    invitation_id IN (
      SELECT id FROM invitations 
      WHERE planner_email = auth.email()
    )
  );

-- System/service role creates history entries
-- (handled by triggers, not exposed to public)
```

#### Invitation Assets - Planner Access

```sql
-- Planners can view assets for their invitations
CREATE POLICY "assets_select_own" ON invitation_assets
  FOR SELECT USING (
    invitation_id IN (
      SELECT id FROM invitations 
      WHERE planner_email = auth.email()
    )
  );

-- Planners can insert assets for their invitations
CREATE POLICY "assets_insert_own" ON invitation_assets
  FOR INSERT WITH CHECK (
    invitation_id IN (
      SELECT id FROM invitations 
      WHERE planner_email = auth.email()
    )
  );

-- Planners can delete their assets
CREATE POLICY "assets_delete_own" ON invitation_assets
  FOR DELETE USING (
    invitation_id IN (
      SELECT id FROM invitations 
      WHERE planner_email = auth.email()
    )
  );
```

## 🏗️ Database Relationships

The schema includes these foreign key relationships:

```
planners
  ↑
  │
invitations (planner_email → planners.email)
  ├─→ invitation_edit_history (invitation_id)
  └─→ invitation_assets (invitation_id)
```

This ensures:
- When a planner deletes, all related invitations cascade delete
- Edit history tracks all changes to invitations
- Assets are stored with references to invitations

## 🗂️ Supabase Storage Setup

For image uploads (logos, backgrounds, accent photos):

### 1. Create Storage Bucket

In Supabase Dashboard:
1. Go to **Storage** (left sidebar)
2. Click **Create new bucket**
3. Name it: `invitation-images`
4. Choose: **Private** (so only planners can access their own images)
5. Click **Create**

### 2. Create Storage Policies

Go to Storage → invitation-images → **Policies** tab:

```sql
-- Planners can upload images
CREATE POLICY "Users can upload to their folder" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'invitation-images' AND
    auth.email() = (storage.foldername(name))[1]
  );

-- Planners can view their images
CREATE POLICY "Users can view their images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'invitation-images' AND
    auth.email() = (storage.foldername(name))[1]
  );

-- Planners can delete their images
CREATE POLICY "Users can delete their images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'invitation-images' AND
    auth.email() = (storage.foldername(name))[1]
  );
```

## 🧪 Testing RLS Policies

### Test with Supabase Client

After setting up RLS, test with a simple request:

```javascript
// src/lib/supabase.ts test
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// This should fail (no auth) unless is_published = true
const { data, error } = await supabase
  .from('invitations')
  .select('*')
  .eq('event_slug', 'test-event')

console.log(error) // Should see "Insufficient permissions"
```

### Test Published Invitations

If you added the "published" policy, test:

```javascript
// This should work (if is_published = true)
const { data } = await supabase
  .from('invitations')
  .select('*')
  .eq('event_slug', 'test-event')
  .eq('is_published', true)
```

## 📊 Current Database State

**Tables Created:**
- planners (email as unique identifier)
- invitations (with all customization fields)
- invitation_edit_history (audit trail)
- invitation_assets (image references)

**Indexes Created:**
- idx_invitations_slug (for fast event lookup)
- idx_invitations_planner_email (for planner-specific queries)
- idx_history_invitation_id (for edit history queries)

**Relationships:**
- FK: invitations.planner_email → planners.email
- FK: invitation_edit_history.invitation_id → invitations.id
- FK: invitation_assets.invitation_id → invitations.id

## 🔐 Security Checklist

- [ ] RLS enabled on all tables
- [ ] RLS policies created for each table
- [ ] Service role key never exposed in browser code
- [ ] Anonymous key used only for public queries
- [ ] Storage bucket created for images
- [ ] Storage policies restrict access to own files
- [ ] NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel env vars

## 🚀 Next Steps

1. ✅ Set up Vercel environment variables (VERCEL_SETUP.md)
2. ✅ Create sample test data
3. ✅ Test app with `/invite?event=test-event`
4. ⏳ Build admin dashboard for planners
5. ⏳ Add image upload functionality
6. ⏳ Set up email notifications

## Troubleshooting

### "Insufficient permissions" errors
- ✅ Check that RLS policies are created
- ✅ Verify auth.email() is being used in policies
- ✅ For testing, temporarily disable RLS on one table

### Images not loading from Storage
- ✅ Verify bucket is named `invitation-images`
- ✅ Check storage policies allow access
- ✅ Verify files are in correct folder structure

### Queries returning empty results
- ✅ RLS might be too restrictive
- ✅ Check that planner_email matches auth.email()
- ✅ Temporarily test with RLS disabled on one table

### Still seeing "falling back to hardcoded config"
- This is expected! The app gracefully degrades
- Create test data to see real Supabase data
- Check browser console for actual errors

## References

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
