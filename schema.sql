-- Standup AI MVP Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Teams Table
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    timezone VARCHAR(100) DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Users Table (Linked with Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('member', 'manager')) DEFAULT 'member',
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Standups Table
CREATE TABLE IF NOT EXISTS public.standups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    transcript TEXT,
    summary_json JSONB DEFAULT '{}'::jsonb, -- { "status": "...", "blockers": "...", "next_steps": "..." }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sample Seed Data
INSERT INTO public.teams (id, name, timezone)
VALUES ('11111111-1111-1111-1111-111111111111', 'Engineering Team Alpha', 'America/New_York')
ON CONFLICT (id) DO NOTHING;
