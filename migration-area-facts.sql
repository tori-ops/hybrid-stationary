-- Add new JSON array columns for structured area facts
-- Run this in Supabase SQL Editor

ALTER TABLE public.invitations 
ADD COLUMN IF NOT EXISTS attractions_list jsonb DEFAULT '[]'::jsonb;

ALTER TABLE public.invitations 
ADD COLUMN IF NOT EXISTS dining_list jsonb DEFAULT '[]'::jsonb;

ALTER TABLE public.invitations 
ADD COLUMN IF NOT EXISTS activities_list jsonb DEFAULT '[]'::jsonb;

ALTER TABLE public.invitations 
ADD COLUMN IF NOT EXISTS accommodations_list jsonb DEFAULT '[]'::jsonb;

-- Update the updated_at timestamp
UPDATE public.invitations SET updated_at = NOW() WHERE updated_at IS NOT NULL;
