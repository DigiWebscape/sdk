import { NextResponse } from 'next/server';
import { DigiWebscape } from '@digiwebscape/sdk';

/**
 * Server-Side API Proxy Route for Next.js App Router
 * Safely queries DigiWebscape from the server without leaking API keys to the browser.
 */

// Initialize client once on the server runtime
const client = new DigiWebscape({
  apiKey: process.env.DIGIWEBSCAPE_API_KEY,
  organizationId: process.env.DIGIWEBSCAPE_ORG_ID
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, params } = body;

    // Optional: Authenticate session or user before proxying
    // const session = await getSession(req);
    // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    switch (action) {
      case 'getVisibilityMetrics': {
        const metrics = await client.visibility.getMetrics(params.projectId);
        return NextResponse.json(metrics);
      }

      case 'getRealtimePulse': {
        const pulse = await client.insights.getRealtime(params.projectId, params.range || '24h');
        return NextResponse.json(pulse);
      }

      case 'auditDomain': {
        const audit = await client.visibility.auditDomain({
          domain: params.domain,
          focus_queries: params.focusQueries
        });
        return NextResponse.json(audit);
      }

      default:
        return NextResponse.json({ error: `Unsupported action: ${action}` }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Proxy execution error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
