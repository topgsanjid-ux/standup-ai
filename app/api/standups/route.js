import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabase/server';

// In-memory persistent mock storage for immediate demo usage if database is unconfigured
let initialStandups = [
  {
    id: 'st-1',
    user_name: 'Sarah Chen',
    user_role: 'Staff Backend Engineer',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SarahChen',
    media_url: null,
    transcript: 'Today I refactored the auth token middleware and implemented rate limiting using Upstash Redis. Blockers: Facing a minor CORS issue on the Supabase storage bucket policy. Next steps: Complete GraphQL queries for team digest.',
    summary: {
      status: 'Refactored auth token middleware & implemented Upstash Redis rate limiting.',
      blockers: 'CORS policy misconfiguration on Supabase storage bucket.',
      next_steps: 'Complete GraphQL queries for daily team digest.'
    },
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    likes: 4,
    comments: [
      { id: 101, author: 'Marcus Vance', text: 'I fixed a similar CORS policy yesterday, I can review your bucket config!', time: '30m ago' }
    ]
  },
  {
    id: 'st-2',
    user_name: 'Marcus Vance',
    user_role: 'Tech Lead',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=MarcusVance',
    media_url: null,
    transcript: 'Conducted sprint planning and finalized the Q3 architecture roadmap for microservices. No blockers. Next steps: Sync with product team on search archive wireframes.',
    summary: {
      status: 'Conducted sprint planning & finalized Q3 microservices architecture roadmap.',
      blockers: 'None reported.',
      next_steps: 'Sync with product design team on search archive wireframes.'
    },
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    likes: 6,
    comments: []
  },
  {
    id: 'st-3',
    user_name: 'Priya Patel',
    user_role: 'DevOps Lead',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=PriyaPatel',
    media_url: null,
    transcript: 'Migrated staging environment to Kubernetes v1.29 and updated CI/CD Github Actions pipeline. No blockers. Next steps: Run security audit and benchmark database indexing performance.',
    summary: {
      status: 'Migrated staging cluster to Kubernetes v1.29 & updated CI/CD GitHub Actions.',
      blockers: 'None reported.',
      next_steps: 'Perform automated security audit & database indexing benchmark.'
    },
    created_at: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    likes: 3,
    comments: []
  }
];

export async function GET() {
  try {
    // Attempt Supabase fetch if URL is configured and not default demo
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('demo-placeholder')) {
      const { data, error } = await supabaseServer
        .from('standups')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, standups: data });
      }
    }
  } catch (err) {
    console.warn('Supabase DB fetch fallback activated:', err.message);
  }

  // Return in-memory initial standups fallback
  return NextResponse.json({ success: true, standups: initialStandups });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { user_name, user_role, avatar, media_url, transcript, summary } = body;

    const newStandup = {
      id: `st-${Date.now()}`,
      user_name: user_name || 'Anonymous Engineer',
      user_role: user_role || 'Team Member',
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`,
      media_url: media_url || null,
      transcript: transcript || 'Audio standup recorded.',
      summary: summary || {
        status: 'Updated daily task progress.',
        blockers: 'None reported.',
        next_steps: 'Continue feature development.'
      },
      created_at: new Date().toISOString(),
      likes: 0,
      comments: []
    };

    // Store in memory
    initialStandups.unshift(newStandup);

    // Attempt Supabase insert if available
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('demo-placeholder')) {
        await supabaseServer.from('standups').insert([{
          media_url: media_url || 'voice_recording.webm',
          transcript,
          summary_json: summary
        }]);
      }
    } catch (dbErr) {
      console.warn('Supabase DB write skipped/failed:', dbErr.message);
    }

    return NextResponse.json({ success: true, standup: newStandup });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
