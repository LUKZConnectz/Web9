// pages/api/transactions/get-client-secret.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabase';
import { stripe } from '../../../lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { txId } = req.body;
  if (!txId) return res.status(400).json({ error: 'Missing txId' });

  // fetch transaction
  const { data: tx, error } = await supabaseAdmin.from('transactions').select('*').eq('id', txId).single();
  if (error || !tx) return res.status(404).json({ error: 'Transaction not found' });

  // if provider_payment_id exists, fetch from stripe to get client_secret
  if (tx.provider_payment_id) {
    try {
      const pi = await stripe.paymentIntents.retrieve(tx.provider_payment_id);
      return res.status(200).json({ clientSecret: pi.client_secret });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to retrieve payment intent' });
    }
  }

  return res.status(400).json({ error: 'No payment intent associated' });
}
