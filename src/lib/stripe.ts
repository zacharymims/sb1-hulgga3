import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_live_51Nu0aWLfNrFgU5QrXpBxiPVaNx5eeIq0IximgfBPSEts6bUoqUxNZ1wV87iiLkOw7OqMBpPWPA1ROIG1hC8A7Lhv00hhDChYMg');

export const STRIPE_PRICES = {
  basic: 'plink_1QIkiFLfNrFgU5QrF0IBI3nP',
  plus: 'plink_1QIkiBLfNrFgU5Qr0KN99LFd',
  pro: 'plink_1QIki6LfNrFgU5QrnG5wRiYe'
};

export async function createCheckoutSession(priceId: string, userId: string) {
  try {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to load');

    const response = await fetch('/.netlify/functions/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`,
      }),
    });

    const session = await response.json();

    if (session.error) {
      throw new Error(session.error);
    }

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
}