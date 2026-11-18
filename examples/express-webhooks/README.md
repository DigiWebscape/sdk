# Express Webhook Handler Recipe

Demonstrates timing-safe webhook verification for Node.js Express servers.

## Key Pattern
Express routes receiving signed webhooks must capture the raw body string rather than parsing JSON upfront, so the HMAC signature matches the exact bytes signed by the sender:

```typescript
app.post('/webhooks/digiwebscape', express.raw({ type: 'application/json' }), handler);
```
