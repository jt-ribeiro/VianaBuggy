import { NextResponse } from 'next/server';
import { tours } from '@/lib/tours';
import { generateBookingRef } from '@/lib/utils';
import { sendOperatorNotification, BookingData } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tourId, date, buggyType, quantity, name, email, phone, notes, paymentMethod } = body;

    if (!tourId || !date || !buggyType || !quantity || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Faltam dados obrigatórios para a reserva.' },
        { status: 400 }
      );
    }

    const tour = tours.find(t => t.id === tourId);
    if (!tour) {
      return NextResponse.json({ error: 'Tour não encontrado.' }, { status: 404 });
    }

    const unitPrice = buggyType === '2-seater' ? tour.price2Seater : tour.price4Seater;
    const reference = generateBookingRef();

    const booking: BookingData = {
      reference,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      tourName: tour.name,
      date,
      buggyType,
      quantity,
      totalPrice: unitPrice * quantity,
      paymentMethod: paymentMethod === 'mbway' ? 'MBWay' : paymentMethod,
      notes,
      status: paymentMethod === 'mbway' ? 'pendente_mbway' : 'pendente',
    };

    // Log to console instead of database for this implementation
    console.log('Nova reserva criada:', booking);

    // Notify operator about the new pending booking
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
