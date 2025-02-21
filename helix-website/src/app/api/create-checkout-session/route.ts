export const runtime = 'edge'

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia'
});

export async function POST(request: Request) {
  try {
    const { priceId, userId, instanceConfig } = await request.json();

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: new URL('/payment-success', process.env.NEXT_PUBLIC_BASE_URL!).toString() + '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: new URL('/create-instance', process.env.NEXT_PUBLIC_BASE_URL!).toString(),
      metadata: {
        userId,
        instanceConfig: JSON.stringify(instanceConfig),
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
} 