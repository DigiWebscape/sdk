import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@digiwebscape/sdk';

/**
 * Next.js App Router Webhook Receiver for DigiWebscape
 * Handles timing-safe signature verification and event dispatching.
 */
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signatureHeader = req.headers.get('x-digiwebscape-signature') || '';
    const secret = process.env.DIGIWEBSCAPE_WEBHOOK_SECRET;

    if (!secret) {
      return NextResponse.json(
        { error: 'Server misconfiguration: missing webhook secret' },
        { status: 500 }
      );
    }

    const isValid = await verifyWebhookSignature(rawBody, signatureHeader, secret);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid webhook signature or expired timestamp' },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);

    // Dispatch based on canonical event namespace
    switch (payload.event) {
      case 'atp.order.completed':
        // Handle completed autonomous order / digital license provisioning
        break;

      case 'atp.order.reserved':
        // Handle stock reservation lock
        break;

      case 'insights.conversion.recorded':
        // Handle conversion event
        break;

      case 'visibility.sweep.completed':
        // Handle AI visibility sweep completion
        break;

      default:
        // Handle generic or custom event
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
