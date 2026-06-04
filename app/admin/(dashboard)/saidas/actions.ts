'use server';

import { createClient } from '@/lib/supabase/server';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export async function getMonthData(dateStr: string) {
  const supabase = await createClient();
  const date = new Date(dateStr);
  const startDate = format(startOfMonth(date), 'yyyy-MM-dd');
  const endDate = format(endOfMonth(date), 'yyyy-MM-dd');

  // Fetch reservations
  const { data: reservations } = await supabase
    .from('reservations')
    .select(`
      id, slot_date, slot_time, buggy_quantity, status, customer_name, buggy_type, booking_ref,
      tours_config:tour_id (id, name, max_buggies_per_slot)
    `)
    .in('status', ['confirmado', 'concluido', 'pendente', 'pendente_mbway'])
    .gte('slot_date', startDate)
    .lte('slot_date', endDate);

  // Fetch blocked dates
  const { data: blockedDates } = await supabase
    .from('blocked_dates')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate);

  // Fetch extra slots
  const { data: extraSlots } = await supabase
    .from('extra_slots')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate);

  // Fetch all active tours for the modal
  const { data: tours } = await supabase
    .from('tours_config')
    .select('id, name, time_slots, available_days, max_buggies_per_slot')
    .eq('is_active', true);

  return {
    reservations: reservations || [],
    blockedDates: blockedDates || [],
    extraSlots: extraSlots || [],
    tours: tours || []
  };
}
