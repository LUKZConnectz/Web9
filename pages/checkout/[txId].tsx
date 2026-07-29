// pages/checkout/[txId].tsx

import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import CheckoutForm from '../../components/CheckoutForm';

export default function CheckoutPage() {
  const router = useRouter();
  const { txId } = router.query;
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!txId) return;
    // fetch transaction to get client secret (you could also have created transaction on this page)
    async function fetchClientSecret() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/transactions/get-client-secret', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ txId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch');
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchClientSecret();
  }, [txId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!clientSecret) return <div>No client secret available</div>;

  return (
    <div>
      <h1>Checkout</h1>
      <CheckoutForm clientSecret={clientSecret} />
    </div>
  );
}
