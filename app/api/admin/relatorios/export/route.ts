import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { format, endOfDay } from 'date-fns';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response('Não autorizado', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');

    if (!fromDate || !toDate) {
      return new Response('Datas são obrigatórias', { status: 400 });
    }

    const { data: reservations, error } = await supabase
      .from('reservations')
      .select(`
        *,
        tours_config:tour_id (name)
      `)
      .in('status', ['confirmado', 'concluido'])
      .gte('created_at', new Date(fromDate).toISOString())
      .lte('created_at', endOfDay(new Date(toDate)).toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Generate CSV
    const headers = [
      'Data de Compra',
      'Referencia',
      'Nome',
      'Email',
      'Telefone',
      'Tour',
      'Data Tour',
      'Hora Tour',
      'Tipo Buggy',
      'Qtd Buggies',
      'Pessoas',
      'Pagamento',
      'Estado',
      'Total (€)'
    ];

    const rows = reservations.map(r => {
      return [
        format(new Date(r.created_at), 'yyyy-MM-dd HH:mm'),
        r.booking_ref,
        `"${r.customer_name}"`, // Quote to avoid comma issues
        r.customer_email,
        r.customer_phone,
        `"${r.tours_config?.name || 'Desconhecido'}"`,
        r.slot_date,
        r.slot_time,
        r.buggy_type,
        r.buggy_quantity,
        r.people_count,
        r.payment_method,
        r.status,
        (r.total_price / 100).toFixed(2)
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="vianabuggy-relatorio-${fromDate}-a-${toDate}.csv"`,
      },
    });

  } catch (error: any) {
    console.error('Error generating CSV:', error);
    return new Response('Erro a gerar CSV', { status: 500 });
  }
}
