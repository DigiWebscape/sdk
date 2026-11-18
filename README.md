# @digiwebscape/sdk

Official Isomorphic TypeScript SDK for the [DigiWebscape Platform](https://digiwebscape.com) (AI Visibility Matrix™, Private Insights Telemetry™, Content Architecture Studio™, Webhooks & Model Context Protocol).

Runs seamlessly across modern JavaScript and TypeScript environments including **Node.js (18+)**, **Deno**, **Bun**, **Next.js (App & Pages Router)**, and edge runtimes with zero external runtime dependencies.

---

## Installation

```bash
npm install @digiwebscape/sdk
# or
pnpm add @digiwebscape/sdk
# or
yarn add @digiwebscape/sdk
```

---

## Quickstart

```typescript
import { DigiWebscape } from '@digiwebscape/sdk';

const client = new DigiWebscape({
  apiKey: process.env.DIGIWEBSCAPE_API_KEY || 'dw_live_...',
  organizationId: process.env.DIGIWEBSCAPE_ORG_ID
});

// 1. Fetch AI Visibility Benchmarks
const metrics = await client.visibility.getMetrics('prj_your_project_id');
console.log('Visibility Score:', metrics.visibility_score);

// 2. Query Private Insights Realtime Pulse (Cookieless Analytics)
const realtime = await client.insights.getRealtime('prj_your_project_id', '24h');
console.log('Active Visitors:', realtime.active_visitors);

// 3. Register a Webhook Endpoint (Slack, Discord, or Standard JSON)
const webhook = await client.webhooks.create({
  name: 'Alerts Channel',
  url: 'https://hooks.slack.com/services/T00/B00/X00',
  events: ['insights.conversion.recorded', 'visibility.sweep.completed'],
  format: 'slack'
});

// 4. Generate Cursor or Claude Desktop MCP Configuration
const mcp = client.mcp.getConfig('cursor');
console.log(mcp.config);
```

---

## Inbound Webhook Signature Verification

The SDK exports a timing-safe signature verification utility built on standard W3C Web Crypto (`crypto.subtle`):

```typescript
import { verifyWebhookSignature } from '@digiwebscape/sdk';

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signatureHeader = req.headers.get('x-digiwebscape-signature') || '';
  const secret = process.env.DIGIWEBSCAPE_WEBHOOK_SECRET!;

  const isValid = await verifyWebhookSignature(rawBody, signatureHeader, secret);
  if (!isValid) {
    return new Response('Invalid webhook signature', { status: 401 });
  }

  const event = JSON.parse(rawBody);
  console.log('Verified Event:', event.event);

  return new Response('OK', { status: 200 });
}
```

---

## Integration Recipes & Examples

Explore complete, ready-to-use sample templates in the [`examples/`](./examples/) directory:

* [`examples/nextjs-app-router/`](./examples/nextjs-app-router/): Next.js 14/15 App Router route handlers for timing-safe webhook ingestion and secure server-side API proxying.
* [`examples/express-webhooks/`](./examples/express-webhooks/): Node.js Express server capturing raw request streams for signature verification.

---

## Evaluation Mode

Developers exploring SDK methods without a paid subscription can initialize with preview mode credentials:

```typescript
const client = new DigiWebscape({ apiKey: 'dw_eval_preview' });
```

---

## License & Fair Use

* **License**: MIT License ([LICENSE](./LICENSE)).
* **Programmatic Fair Use**: Governed by Section 10 of the DigiWebscape Terms of Service at [`https://digiwebscape.com/terms/#t7`](https://digiwebscape.com/terms/#t7).
* **Copyright**: Copyright © 2026 DigiWebscape. All rights reserved.
