// pages/api/webhooks/stripe.ts

import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '../../../lib/stripe';
import { supabaseAdmin } from '../../../lib/supabase';

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);
  let event;

  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig as string, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as any;
    const txId = intent.metadata?.transaction_id;
    if (txId) {
      // mark transaction paid using service role
      await supabaseAdmin
        .from('transactions')
        .update({ status: 'paid', raw_payload: intent, provider_payment_id: intent.id, updated_at: new Date().toISOString() })
        .eq('id', txId);

      // create a fulfillment log (the actual fulfillment worker/integration goes here)
      await supabaseAdmin.from('fulfillment_logs').insert([{ transaction_id: txId, status: 'triggered', detail: 'Payment succeeded (webhook)' }]);

      // TODO: enqueue background job to call game API and update fulfillment_logs with result
    }
  } else if (event.type === 'payment_intent.payment_failed') {
    const intent = event.data.object as any;
    const txId = intent.metadata?.transaction_id;
    if (txId) {
      await supabaseAdmin
        .from('transactions')
        .update({ status: 'failed', raw_payload: intent, updated_at: new Date().toISOString() })
        .eq('id', txId);

      await supabaseAdmin.from('fulfillment_logs').insert([{ transaction_id: txId, status: 'payment_failed', detail: JSON.stringify(intent.last_payment_error || intent) }]);
    }
  }

  res.json({ received: true });
}
