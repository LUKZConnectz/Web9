import React, { useEffect, useState } from 'react';

type Metric = { orders: number; revenue: number; users: number };
type Product = { id: string; name: string; price: number; stock: number };
type Order = { id: string; user_id: string | null; status: string; total: number };

export default function AdminPage() {
  const [metrics, setMetrics] = useState<Metric | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  async function fetchJson(url: string, opts: RequestInit = {}) {
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error((await res.json()).error || res.statusText);
    return res.json();
  }

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [m, p, o] = await Promise.all([
        fetchJson('/api/admin/metrics'),
        fetchJson('/api/admin/products'),
        fetchJson('/api/admin/orders'),
      ]);
      setMetrics(m);
      setProducts(p.products || []);
      setOrders(o.orders || []);
    } catch (err: any) {
      setError(String(err.message || err));
    } finally {
      setLoading(false);
    }
  }

  async function markOrder(id: string, status: string) {
    try {
      await fetchJson(`/api/admin/orders?id=${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await loadAll();
    } catch (err: any) {
      setError(String(err.message || err));
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: 'Inter, system-ui, Arial' }}>
      <h1>Admin Dashboard</h1>
      {error && (
        <div style={{ background: '#fee', color: '#900', padding: 8, borderRadius: 6, marginBottom: 12 }}>{error}</div>
      )}

      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <div style={{ flex: 1, border: '1px solid #e6e6e6', padding: 12, borderRadius: 8 }}>
          <h3>Metrics</h3>
          {metrics ? (
            <pre style={{ margin: 0 }}>{`Orders: ${metrics.orders}\nRevenue: ${metrics.revenue}\nUsers: ${metrics.users}`}</pre>
          ) : (
            <div>Loading metrics…</div>
          )}
        </div>

        <div style={{ flex: 2, border: '1px solid #e6e6e6', padding: 12, borderRadius: 8 }}>
          <h3>Products</h3>
          <div style={{ marginBottom: 8 }}>
            <button onClick={loadAll} style={{ padding: '6px 10px' }}>Refresh</button>
          </div>
          {products ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Price</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td style={{ padding: 8 }}>{p.name}</td>
                    <td style={{ padding: 8 }}>{p.price}</td>
                    <td style={{ padding: 8 }}>{p.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>Loading products…</div>
          )}
        </div>
      </div>

      <div style={{ border: '1px solid #e6e6e6', padding: 12, borderRadius: 8 }}>
        <h3>Orders</h3>
        <div style={{ marginBottom: 8 }}>
          <button onClick={loadAll} style={{ padding: '6px 10px' }}>Refresh</button>
        </div>
        {orders ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8 }}>ID</th>
                <th style={{ textAlign: 'left', padding: 8 }}>User</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Status</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Total</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td style={{ padding: 8 }}>{o.id}</td>
                  <td style={{ padding: 8 }}>{o.user_id || '-'}</td>
                  <td style={{ padding: 8 }}>{o.status}</td>
                  <td style={{ padding: 8 }}>{o.total || 0}</td>
                  <td style={{ padding: 8 }}>
                    <button onClick={() => markOrder(o.id, 'paid')} style={{ marginRight: 8, padding: '6px 8px' }}>Mark Paid</button>
                    <button onClick={() => markOrder(o.id, 'cancelled')} style={{ padding: '6px 8px' }}>Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>Loading orders…</div>
        )}
      </div>

      <div style={{ marginTop: 18 }}>
        <small style={{ color: '#666' }}>Note: API endpoints require SUPABASE_SERVICE_ROLE_KEY on server-side for full functionality. See README_admin.md for setup.</small>
      </div>

      {loading && <div style={{ marginTop: 12 }}>Working…</div>}
    </div>
  );
}
