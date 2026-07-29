// pages/profile/transactions.tsx

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        setTransactions([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('id,product_id,amount_cents,currency,status,created_at,player_uid')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      setTransactions(data || []);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>My Top-up Transactions</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Player UID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.player_uid}</td>
              <td>{(t.amount_cents / 100).toFixed(2)} {t.currency}</td>
              <td>{t.status}</td>
              <td>{new Date(t.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
