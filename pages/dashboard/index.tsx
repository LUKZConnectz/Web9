import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (!data.session) {
        router.replace('/login');
        return;
      }
      setUser(data.session.user);
    });

    // fallback to localStorage-based stats so dashboard shows something
    const users = Number(localStorage.getItem('demo_users') || 12);
    const orders = Number(localStorage.getItem('demo_orders') || 34);
    const revenue = Number(localStorage.getItem('demo_revenue') || 1289.5);
    setStats({ users, orders, revenue });

    return () => { mounted = false; };
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <main style={{ padding: 28 }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1>Dashboard</h1>
        <div>
          <button onClick={signOut} style={{ padding: '8px 12px' }}>Sign out</button>
        </div>
      </header>

      <section style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        <article style={{ padding: 16, borderRadius: 8, background: '#fff', boxShadow: '0 10px 24px rgba(0,0,0,.04)' }}>
          <div style={{ color: '#666', fontWeight: 700 }}>Users</div>
          <strong style={{ fontSize: 24 }}>{stats.users}</strong>
        </article>
        <article style={{ padding: 16, borderRadius: 8, background: '#fff' }}>
          <div style={{ color: '#666', fontWeight: 700 }}>Orders</div>
          <strong style={{ fontSize: 24 }}>{stats.orders}</strong>
        </article>
        <article style={{ padding: 16, borderRadius: 8, background: '#fff' }}>
          <div style={{ color: '#666', fontWeight: 700 }}>Revenue</div>
          <strong style={{ fontSize: 24 }}>{`฿ ${stats.revenue.toFixed(2)}`}</strong>
        </article>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2>Welcome{user?.email ? `, ${user.email}` : ''}</h2>
        <p style={{ color: '#666' }}>This is a minimal dashboard. Replace with Supabase queries to show live data.</p>
      </section>
    </main>
  );
}
