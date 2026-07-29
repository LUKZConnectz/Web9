// pages/api/admin/metrics.js
const { getSupabaseServer } = require('../../../lib/supabaseClient');

module.exports = async function handler(req, res) {
  try {
    const supabase = getSupabaseServer();
    const [{ count: ordersCount }, { sum: revenue }, { count: usersCount }] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.rpc('sum_order_total', {}).then(r => ({ sum: (r.data && r.data.sum) || 0 })).catch(() => ({ sum: 0 })),
      supabase.from('users').select('*', { count: 'exact', head: true }),
    ]);
    // fallback revenue: aggregate orders.total
    let revenueValue = 0;
    try {
      const { data } = await supabase.from('orders').select('total');
      revenueValue = (data || []).reduce((s, o) => s + Number(o.total || 0), 0);
    } catch (e) { revenueValue = 0; }

    res.status(200).json({ orders: ordersCount || 0, revenue: revenueValue, users: usersCount || 0 });
  } catch (err) {
    console.error('metrics api error', err.message || err);
    res.status(500).json({ error: err.message || String(err) });
  }
};