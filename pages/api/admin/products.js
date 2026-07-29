// pages/api/admin/products.js
// Server-side API for admin product management. Requires SUPABASE_SERVICE_ROLE_KEY.
const { getSupabaseServer } = require('../../../lib/supabaseClient');

module.exports = async function handler(req, res) {
  try {
    const supabase = getSupabaseServer();
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ products: data });
    }

    if (req.method === 'POST') {
      const payload = req.body || {};
      const { data, error } = await supabase.from('products').insert([{ name: payload.name, description: payload.description || '', price: payload.price || 0, stock: payload.stock || 0, featured: !!payload.featured }]).select().single();
      if (error) throw error;
      return res.status(201).json({ product: data });
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const { id } = req.query;
      const payload = req.body || {};
      if (!id) return res.status(400).json({ error: 'missing product id' });
      const { data, error } = await supabase.from('products').update(payload).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json({ product: data });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'missing product id' });
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return res.status(204).end();
    }

    res.setHeader('Allow', 'GET,POST,PUT,PATCH,DELETE');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error('products api error', err.message || err);
    res.status(500).json({ error: err.message || String(err) });
  }
};