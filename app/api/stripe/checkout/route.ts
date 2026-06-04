import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { generateBookingRef } from '@/lib/utils';
import { createServiceRoleClient } from '@/lib/supabase/service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tourId, date, timeSlot, buggyType, quantity, name, email, phone, notes, groupId } = body;

    if (!tourId || !date || !timeSlot || !buggyType || !quantity || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Faltam dados obrigatórios para a reserva.' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();
    
    // Fetch tour from DB
    const { data: tour, error: tourError } = await supabase
      .from('tours_config')
      .select('name, price_2seater, price_4seater, image_url')
      .eq('id', tourId)
      .single();

    if (tourError || !tour) {
      return NextResponse.json({ error: 'Tour não encontrado na base de dados.' }, { status: 404 });
    }

    const unitPrice = buggyType === '2-seater' ? tour.price_2seater : tour.price_4seater;
    const amountCents = unitPrice * 100;
    const reference = generateBookingRef();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Reserva: ${tour.name}`,
              description: `Buggy ${buggyType === '2-seater' ? '2 Lugares' : '4 Lugares'} - Data: ${date} às ${timeSlot}`,
              images: [`https://www.vianabuggy.pt${tour.image_url}`],
            },
            unit_amount: amountCents,
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reservas/confirmacao?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reservas`,
      customer_email: email,
      metadata: {
        reference,
        tourId,
        tourName: tour.name,
        date,
        timeSlot,
        groupId: groupId || '',
        buggyType,
        quantity: quantity.toString(),
        name,
        email,
        phone,
        notes: notes || '',
        totalPrice: (unitPrice * quantity).toString(),
        type: 'tour_booking',
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao criar sessão de pagamento' },
      { status: 500 }
    );
  }
}

