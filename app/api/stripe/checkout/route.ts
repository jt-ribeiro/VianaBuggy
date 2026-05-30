import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { tours } from '@/lib/tours';
import { generateBookingRef } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tourId, date, buggyType, quantity, name, email, phone, notes } = body;

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
              description: `Buggy ${buggyType === '2-seater' ? '2 Lugares' : '4 Lugares'} - Data: ${new Date(date).toLocaleDateString('pt-PT')}`,
              images: [`https://www.vianabuggy.pt${tour.image}`],
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
