import { NextResponse } from 'next/server';
import { generateBookingRef } from '@/lib/utils';
import { sendOperatorNotification, BookingData } from '@/lib/email';
import { createServiceRoleClient } from '@/lib/supabase/service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tourId, date, timeSlot, buggyType, quantity, name, email, phone, notes, paymentMethod, groupId } = body;

    if (!tourId || !date || !timeSlot || !buggyType || !quantity || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Faltam dados obrigatórios para a reserva.' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // 1. Fetch tour details to calculate price
    const { data: tour, error: tourError } = await supabase
      .from('tours_config')
      .select('name, price_2seater, price_4seater')
      .eq('id', tourId)
      .single();

    if (tourError || !tour) {
      return NextResponse.json({ error: 'Tour não encontrado.' }, { status: 404 });
    }

    const unitPrice = buggyType === '2-seater' ? tour.price_2seater : tour.price_4seater;
    const reference = generateBookingRef();
    const totalPrice = unitPrice * quantity;
    
    // Calculate people count
    const peopleCount = buggyType === '2-seater' ? quantity * 2 : quantity * 4;
    const status = paymentMethod === 'mbway' ? 'pendente_mbway' : 'pendente';

    // 2. Insert into Supabase reservations
    const { error: insertError } = await supabase
      .from('reservations')
      .insert({
        booking_ref: reference,
        tour_id: tourId,
        group_id: groupId || null,
        slot_date: date,
        slot_time: timeSlot,
        buggy_type: buggyType,
        buggy_quantity: quantity,
        people_count: peopleCount,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        notes: notes || '',
        status: status,
        payment_method: paymentMethod === 'mbway' ? 'MBWay' : paymentMethod,
        total_price: totalPrice
      });

    if (insertError) {
      console.error('Supabase Insert Error:', insertError);
      throw new Error('Falha ao guardar a reserva na base de dados.');
    }

    const booking: BookingData = {
      reference,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      tourName: tour.name,
      date: `${date} às ${timeSlot}`,
      buggyType,
      quantity,
      totalPrice,
      paymentMethod: paymentMethod === 'mbway' ? 'MBWay' : paymentMethod,
      notes,
      status,
    };

    // 3. Notify operator
    await sendOperatorNotification(booking);

    return NextResponse.json({ 
      success: true, 
      reference,
      message: 'Reserva criada com sucesso.' 
    });
  } catch (error: any) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar reserva.' },
      { status: 500 }
    );
  }
}
