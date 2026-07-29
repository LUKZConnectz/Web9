import React, { useEffect, useState } from 'react';

type Product = {
  id?: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  featured?: boolean;
};

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Product>({ name: '', description: '', price: 0, stock: 0, featured: false });

  useEffect(() => { loadProducts(); }, []);

  async function fetchJson(url: string, opts: RequestInit = {}) {
    const res = await fetch(url, opts);
    if (!res.ok) {
      let body;
      try { body = await res.json(); } catch { body = { error: res.statusText }; }
      throw new Error(body?.error || res.statusText || 'Request failed');
    }
    return res.json();
  }

  async function loadProducts() {
    setLoading(true);
    setError(null);
    try {
      const j = await fetchJson('/api/admin/products');
      setProducts(j.products || []);
    } catch (err: any) {
      setError(String(err.message || err));
    } finally { setLoading(false); }
  }

  function resetForm() {
    setEditing(null);
    setForm({ name: '', description: '', price: 0, stock: 0, featured: false });
  }

  function bind<K extends keyof Product>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.currentTarget.type === 'checkbox' ? (e.currentTarget as HTMLInputElement).checked : e.currentTarget.value;
      setForm(prev => ({ ...prev, [key]: key === 'price' || key === 'stock' ? Number(value) : value } as Product));
    };
  }

  async function submitForm(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setLoading(true); setError(null);
    try {
      if (editing && editing.id) {
        await fetchJson(`/api/admin/products?id=${encodeURIComponent(editing.id)}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
        });
      } else {
        await fetchJson('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      }
      await loadProducts();
      resetForm();
    } catch (err: any) {
      setError(String(err.message || err));
    } finally { setLoading(false); }
  }

  function startEdit(p: Product) {
    setEditing(p);
    setForm({ name: p.name, description: p.description || '', price: Number(p.price || 0), stock: Number(p.stock || 0), featured: !!p.featured, id: p.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function removeProduct(id?: string) {
    if (!id) return;
    if (!confirm('ลบสินค้านี้แน่หรือไม่?')) return;
    setLoading(true); setError(null);
    try {
      await fetchJson(`/api/admin/products?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      await loadProducts();
      if (editing?.id === id) resetForm();
    } catch (err: any) {
      setError(String(err.message || err));
    } finally { setLoading(false); }
  }

  return (
    <div style={{ padding: 20, fontFamily: 'Inter, system-ui, Arial' }}>
      <h1>Products — Admin</h1>
      {error && <div style={{ background: '#fee', color: '#900', padding: 8, borderRadius: 6, marginBottom: 12 }}>{error}</div>}

      <form onSubmit={submitForm} style={{ marginBottom: 18, border: '1px solid #e6e6e6', padding: 12, borderRadius: 8 }}>
        <h3>{editing ? 'Edit product' : 'Add product'}</h3>
        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700 }}>Name</label>
            <input required value={form.name} onChange={bind('name')} style={{ width: '100%', height: 36, padding: 8 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700 }}>Price</label>
            <input required type="number" value={String(form.price)} onChange={bind('price')} style={{ width: '100%', height: 36, padding: 8 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700 }}>Stock</label>
            <input required type="number" value={String(form.stock)} onChange={bind('stock')} style={{ width: '100%', height: 36, padding: 8 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700 }}>Featured</label>
            <input type="checkbox" checked={!!form.featured} onChange={bind('featured') as any} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700 }}>Description</label>
            <textarea value={form.description} onChange={bind('description')} style={{ width: '100%', minHeight: 80, padding: 8 }} />
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <button type="submit" disabled={loading} style={{ padding: '8px 12px', marginRight: 8 }}>{editing ? 'Update' : 'Create'}</button>
          <button type="button" onClick={resetForm} style={{ padding: '8px 12px' }}>Clear</button>
        </div>
      </form>

      <div style={{ border: '1px solid #e6e6e6', padding: 12, borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>All products</h3>
          <div>
            <button onClick={loadProducts} style={{ padding: '6px 10px' }}>Refresh</button>
          </div>
        </div>

        {products && products.length ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Price</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Stock</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Featured</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td style={{ padding: 8 }}>{p.name}</td>
                  <td style={{ padding: 8 }}>{p.price}</td>
                  <td style={{ padding: 8 }}>{p.stock}</td>
                  <td style={{ padding: 8 }}>{p.featured ? 'Yes' : '-'}</td>
                  <td style={{ padding: 8 }}>
                    <button onClick={() => startEdit(p)} style={{ marginRight: 8, padding: '6px 8px' }}>Edit</button>
                    <button onClick={() => removeProduct(p.id)} style={{ padding: '6px 8px' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No products</div>
        )}
      </div>

      {loading && <div style={{ marginTop: 12 }}>Working…</div>}
    </div>
  );
}
