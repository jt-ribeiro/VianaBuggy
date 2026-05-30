import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { sendBookingConfirmation, sendOperatorNotification, BookingData } from '@/lib/email';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret is not set' }, { status: 500 });
  }

  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    if (session.metadata?.type === 'tour_booking') {
      const metadata = session.metadata;
      
      const booking: BookingData = {
        reference: metadata.reference,
        customerName: metadata.name,
        customerEmail: metadata.email,
        customerPhone: metadata.phone,
        tourName: metadata.tourName,
        date: metadata.date,
        buggyType: metadata.buggyType,
        quantity: parseInt(metadata.quantity),
        totalPrice: parseFloat(metadata.totalPrice),
        paymentMethod: 'Stripe (Cartão)',
        notes: metadata.notes,
        status: 'confirmada',
      };

      // Send emails
      await Promise.all([
        sendBookingConfirmation(booking),
        sendOperatorNotification(booking),
      ]);
      
      console.log(`Booking confirmed for session ${session.id}. Ref: ${booking.reference}`);
    }
  }

  return NextResponse.json({ received: true });
}
