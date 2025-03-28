import { NextResponse } from 'next/server';
import api from '@/app/api';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const signature = request.headers.get('autumn-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature found' }, { status: 401 });
    }

    // Verify the webhook signature (implementation depends on Autumn's verification method)
    // TODO: Implement signature verification when Autumn provides documentation

    // Handle different webhook events
    switch (payload.type) {
      case 'payment.succeeded':
        // Extract the metadata from the payload
        const { metadata, customer_id } = payload;
        
        // Create the instance using the metadata
        await api.createInstance({
          userId: customer_id,
          region: metadata.region,
          instanceName: metadata.instanceName,
          vcpus: metadata.vcpus,
          memory: metadata.memory,
          storage: metadata.storage,
        });
        break;

      // Add other webhook event handlers as needed
      default:
        console.log(`Unhandled webhook event: ${payload.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 