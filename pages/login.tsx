import { useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // if already signed in, go to dashboard
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/dashboard');
    });
  }, [router]);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <div style={{ width: 420, padding: 28, borderRadius: 12, boxShadow: '0 22px 60px rgba(16,24,40,.1)', background: '#fff' }}>
        <h1 style={{ margin: 0 }}>เข้าสู่ระบบ</h1>
        <p style={{ color: '#666' }}>เข้าสู่ระบบด้วย Google</p>
        <div style={{ marginTop: 18 }}>
          <button onClick={signInWithGoogle} style={{ width: '100%', height: 44, background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700 }}>Sign in with Google</button>
        </div>
      </div>
    </main>
  );
}
