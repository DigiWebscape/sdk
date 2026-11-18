# Next.js App Router Integration Recipes

Ready-to-use recipes for integrating DigiWebscape into Next.js 14/15 App Router applications.

## Included Recipes

1. **Inbound Webhook Receiver (`app/api/webhooks/digiwebscape/route.ts`)**:
   - Timing-safe HMAC signature verification via `verifyWebhookSignature`.
   - Event routing for `atp.order.*`, `insights.*`, and `visibility.*`.
   - Replay attack rejection using 300-second timestamp tolerance.

2. **Server-Side API Proxy (`app/api/digiwebscape/proxy/route.ts`)**:
   - Queries DigiWebscape API using server-side environment variables.
   - Shields `DIGIWEBSCAPE_API_KEY` from client-side bundles and browser network tabs.

## Environment Variables

Add to your `.env.local`:

```bash
DIGIWEBSCAPE_API_KEY=dw_live_your_key_here
DIGIWEBSCAPE_ORG_ID=org_your_organization_id
DIGIWEBSCAPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret
```
