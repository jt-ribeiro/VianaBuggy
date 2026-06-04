"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateReservationStatus(id: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
