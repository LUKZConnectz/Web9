// pages/api/admin/orders.js
const { getSupabaseServer } = require('../../../lib/supabaseClient');

module.exports = async function handler(req, res) {
  try {
    const supabase = getSupabaseServer();
    if (req.method === 'GET') {
      // expand order items
      const { data, error } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ orders: data });
    }

    if (req.method === 'PATCH') {
      const { id } = req.query;
      const payload = req.body || {};
      if (!id) return res.status(400).json({ error: 'missing order id' });
      const { data, error } = await supabase.from('orders').update(payload).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json({ order: data });
    }

    res.setHeader('Allow', 'GET,PATCH');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error('orders api error', err.message || err);
    res.status(500).json({ error: err.message || String(err) });
  }
};