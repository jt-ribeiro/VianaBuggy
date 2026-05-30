import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getTourById } from '@/lib/tours';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tourId,
      recipientName,
      senderName,
      message,
      senderEmail,
    } = body;

    // Validate required fields
    if (!tourId || !recipientName || !senderName || !senderEmail) {
      return NextResponse.json(
        { error: 'Campos obrigatórios em falta.' },
        { status: 400 }
      );
    }

    // Get tour data
    const tour = getTourById(tourId);
    if (!tour) {
      return NextResponse.json(
        { error: 'Tour não encontrado.' },
        { status: 404 }
      );
    }

    // Voucher price is based on 2-seater price
    const voucherPrice = tour.price2Seater;

    // Create Stripe Checkout session for voucher
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: senderEmail,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Voucher Viana Buggy — ${tour.name}`,
              description: `Voucher presente para ${recipientName}. Tour: ${tour.name} (${tour.duration})`,
              images: [`https://www.vianabuggy.pt${tour.image}`],
            },
            unit_amount: voucherPrice * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: 'voucher',
        tourId,
        tourName: tour.name,
        tourDuration: tour.duration,
        recipientName,
        senderName,
        senderEmail,
        message: message || '',
        voucherPrice: voucherPrice.toString(),
      },
      success_url: `${request.nextUrl.origin}/voucher/confirmacao?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/voucher`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Voucher checkout error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar sessão de pagamento para o voucher. Tenta novamente.' },
      { status: 500 }
    );
  }
}
