import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { sendBookingConfirmation, sendOperatorNotification, BookingData } from '@/lib/email';
import { createServiceRoleClient } from '@/lib/supabase/service';
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
      
      const quantity = parseInt(metadata.quantity);
      const peopleCount = metadata.buggyType === '2-seater' ? quantity * 2 : quantity * 4;

      const supabase = createServiceRoleClient();

      // Insert into Supabase reservations
      const { error: insertError } = await supabase
        .from('reservations')
        .insert({
          booking_ref: metadata.reference,
          tour_id: metadata.tourId,
          group_id: metadata.groupId || null,
          slot_date: metadata.date,
          slot_time: metadata.timeSlot,
          buggy_type: metadata.buggyType,
          buggy_quantity: quantity,
          people_count: peopleCount,
          customer_name: metadata.name,
          customer_email: metadata.email,
          customer_phone: metadata.phone,
          notes: metadata.notes,
          status: 'confirmado',
          payment_method: 'Stripe',
          stripe_session_id: session.id,
          total_price: parseFloat(metadata.totalPrice),
        });

      if (insertError) {
        console.error('Webhook DB Insert Error:', insertError);
        // We still send emails even if DB fails so user has their voucher
      }
      
      const booking: BookingData = {
        reference: metadata.reference,
        customerName: metadata.name,
        customerEmail: metadata.email,
        customerPhone: metadata.phone,
        tourName: metadata.tourName,
        date: `${metadata.date} às ${metadata.timeSlot}`,
        buggyType: metadata.buggyType,
        quantity: quantity,
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
      
      console.log(`Booking confirmed and saved for session ${session.id}. Ref: ${booking.reference}`);
    }
  }

  return NextResponse.json({ received: true });
}
