import Stripe from 'stripe';

// Stripe secret key is checked at runtime when the api is called.

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key_for_build', {
  apiVersion: '2026-05-27.dahlia', // Use the latest supported version or the one installed
  typescript: true,
});
