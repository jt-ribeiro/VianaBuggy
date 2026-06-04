'use server';

import { createClient } from '@/lib/supabase/server';

export async function validateGroupCode(code: string) {
  if (!code || code.length !== 6) return { error: 'Código inválido' };

  const supabase = await createClient();

  const { data: group, error } = await supabase
    .from('groups')
    .select('id, tour_id, slot_date, slot_time, max_buggies, is_open, name')
    .eq('group_code', code.toUpperCase())
    .single();

  if (error || !group) {
    return { error: 'Grupo não encontrado' };
  }

  if (!group.is_open) {
    return { error: 'Este grupo já está fechado' };
  }

  // Check how many buggies are already in this group
  const { data: reservations } = await supabase
    .from('reservations')
    .select('buggy_quantity, status')
    .eq('group_id', group.id)
    .neq('status', 'cancelado');

  const currentBuggies = reservations?.reduce((acc, curr) => acc + curr.buggy_quantity, 0) || 0;

  if (currentBuggies >= group.max_buggies) {
    return { error: 'Este grupo já atingiu o limite de buggies' };
  }

  return { success: true, group, availableBuggies: group.max_buggies - currentBuggies };
}

export async function getReservationForGroup(sessionId?: string, reference?: string) {
  if (!sessionId && !reference) return null;

  const supabase = await createClient();
  let query = supabase.from('reservations').select('id, booking_ref, group_id, status');

  if (sessionId) {
    query = query.eq('stripe_session_id', sessionId);
  } else if (reference) {
    query = query.eq('booking_ref', reference);
  }

  const { data } = await query.single();
  return data;
}

export async function createGroup(reservationId: string, groupName: string) {
  const supabase = await createClient();

  // 1. Get the reservation
  const { data: reservation, error: resError } = await supabase
    .from('reservations')
    .select('tour_id, slot_date, slot_time')
    .eq('id', reservationId)
    .single();

  if (resError || !reservation) return { error: 'Reserva não encontrada' };

  // 2. Generate unique 6-char code
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let groupCode = '';
  let isUnique = false;

  while (!isUnique) {
    groupCode = '';
    for (let i = 0; i < 6; i++) {
      groupCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const { count } = await supabase.from('groups').select('*', { count: 'exact', head: true }).eq('group_code', groupCode);
    if (count === 0) isUnique = true;
  }

  // 3. Create group
  const { data: newGroup, error: groupError } = await supabase
    .from('groups')
    .insert({
      group_code: groupCode,
      tour_id: reservation.tour_id,
      slot_date: reservation.slot_date,
      slot_time: reservation.slot_time,
      creator_reservation_id: reservationId,
      name: groupName || `Grupo ${groupCode}`,
      max_buggies: 6, // default, could be dynamic based on tour
      is_open: true
    })
    .select()
    .single();

  if (groupError) return { error: 'Erro ao criar grupo' };

  // 4. Update reservation with group_id
  await supabase
    .from('reservations')
    .update({ group_id: newGroup.id })
    .eq('id', reservationId);

  return { success: true, group: newGroup };
}
