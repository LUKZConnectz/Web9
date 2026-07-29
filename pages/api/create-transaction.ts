// pages/api/create-transaction.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { stripe } from '../../lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabase = createServerSupabaseClient({ req, res });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const { productId, playerUid, idempotencyKey } = req.body;
  if (!productId || !playerUid) return res.status(400).json({ error: 'Missing fields' });

  // fetch product
  const { data: product, error: prodErr } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (prodErr || !product) return res.status(404).json({ error: 'Product not found' });

  // create transaction row (user-scoped)
  const { data: tx, error: txErr } = await supabase
    .from('transactions')
    .insert([{
      user_id: user.id,
      game_id: product.game_id,
      product_id: product.id,
      player_uid: playerUid,
      amount_cents: product.price_cents,
      currency: product.currency,
      idempotency_key: idempotencyKey || null,
      status: 'pending'
    }])
    .select()
    .single();

  if (txErr || !tx) return res.status(500).json({ error: 'Failed to create transaction' });

  // create stripe payment intent
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: tx.amount_cents,
      currency: (tx.currency || 'THB').toLowerCase(),
      metadata: { transaction_id: tx.id },
    });

    // update transaction with provider info (use service role key via DB update with server-side jwt)
    await supabase
      .from('transactions')
      .update({ payment_provider: 'stripe', provider_payment_id: paymentIntent.id, raw_payload: paymentIntent })
      .eq('id', tx.id);

    return res.status(200).json({ clientSecret: paymentIntent.client_secret, transaction: tx });
  } catch (err) {
    console.error('stripe error', err);
    return res.status(500).json({ error: 'Payment provider error' });
  }
}
