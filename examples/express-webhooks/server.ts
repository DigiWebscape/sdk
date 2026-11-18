import express, { type Request, type Response } from 'express';
import { verifyWebhookSignature } from '@digiwebscape/sdk';

const app = express();
const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.DIGIWEBSCAPE_WEBHOOK_SECRET || '';

// Parse raw buffer for timing-safe signature calculation
app.post(
  '/webhooks/digiwebscape',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response) => {
    try {
      const rawBody = req.body.toString('utf8');
      const signatureHeader = (req.headers['x-digiwebscape-signature'] as string) || '';

      const isValid = await verifyWebhookSignature(rawBody, signatureHeader, WEBHOOK_SECRET);
      if (!isValid) {
        res.status(401).json({ error: 'Invalid webhook signature' });
        return;
      }

      const event = JSON.parse(rawBody);
      console.log('Received verified event:', event.event);

      res.status(200).json({ received: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to process webhook' });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
