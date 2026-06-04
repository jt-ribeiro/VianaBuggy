import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // Formato YYYY-MM
    const date = searchParams.get('date'); // Formato YYYY-MM-DD

    let query = supabase.from('blocked_dates').select('*');

    if (date) {
      query = query.eq('date', date);
    } else if (month) {
      query = query.like('date', `${month}-%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching blocked dates:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { date, time_slot, tour_id, reason } = body;

    if (!date) {
      return NextResponse.json({ error: 'Data é obrigatória' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('blocked_dates')
      .insert([
        {
          date,
          time_slot: time_slot || null,
          tour_id: tour_id || null,
          reason: reason || null,
          created_by: user.id
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error creating blocked date:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
