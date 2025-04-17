export const runtime = 'edge'

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { priceId, userId, instanceConfig } = await request.json();

    // Create a checkout session with Autumn
    const response = await fetch('https://api.useautumn.com/v1/attach', {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AUTUMN_PUBLISHABLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customer_id: userId,
        product_id: priceId,
        success_url: new URL('/dashboard/instances', process.env.NEXT_PUBLIC_BASE_URL!).toString() + '?payment_id={PAYMENT_ID}',
        cancel_url: new URL('/create-instance', process.env.NEXT_PUBLIC_BASE_URL!).toString(),
        metadata: {
          userId: userId,
          region: instanceConfig.region,
          instanceName: instanceConfig.instanceName,
          vcpus: instanceConfig.vcpus,
          memory: instanceConfig.memory,
          storage: instanceConfig.storage,
        }
      })
    });

    const data = await response.json();
    console.log(data);
    if (!data.checkout_url) {
      throw new Error('Failed to create checkout session');
    }

    return NextResponse.json({ checkoutUrl: data.checkout_url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
} 