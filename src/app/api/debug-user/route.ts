import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Handle CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: Request) {
  try {
    if (!supabase) {
      return Response.json(
        { error: 'Server not properly configured. Missing SUPABASE_SERVICE_ROLE_KEY' },
        { status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    console.log(`Debugging user: ${email}`);

    // Check in auth.users
    let authUserExists = false;
    let authUserData = null;
    try {
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      const foundUser = authUsers?.users?.find((u) => u.email === email);
      if (foundUser) {
        authUserExists = true;
        authUserData = {
          id: foundUser.id,
          email: foundUser.email,
          created_at: foundUser.created_at,
          user_metadata: foundUser.user_metadata,
        };
      }
    } catch (err: any) {
      console.error('Error checking auth.users:', err);
    }

    // Check in planners table
    let plannerExists = false;
    let plannerData = null;
    try {
      const { data: planners } = await supabase
        .from('planners')
        .select('*')
        .eq('email', email);

      if (planners && planners.length > 0) {
        plannerExists = true;
        plannerData = planners[0];
      }
    } catch (err: any) {
      console.error('Error checking planners table:', err);
    }

    const response = {
      email,
      auth_user_exists: authUserExists,
      auth_user_data: authUserData,
      planner_record_exists: plannerExists,
      planner_data: plannerData,
      summary: {
        issue: authUserExists && plannerExists 
          ? 'Both auth user and planner record exist - user needs to be deleted from auth.users'
          : authUserExists
          ? 'Auth user exists but NO planner record - orphaned auth user'
          : plannerExists
          ? 'Planner record exists but NO auth user - orphaned planner record'
          : 'User does not exist anywhere',
      },
    };

    return Response.json(response, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    console.error('Debug error:', error);
    return Response.json(
      { error: `Debug error: ${error?.message || error}` },
      { status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
