import { useEffect, useState } from 'react';
import { supabase } from '../src/supabaseClient';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      }
    };
    checkSession();
  }, [router]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
    // TODO: Fetch products and alerts from Supabase
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <h1>Dashboard</h1>
      {user && (
        <div style={{ marginBottom: 24 }}>
          <h2>User Info</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>ID:</strong> {user.id}</p>
        </div>
      )}
      <div style={{ marginBottom: 24 }}>
        <h2>Tracked Products</h2>
        {/* TODO: List tracked products here */}
        {products.length === 0 ? <p>No products tracked yet.</p> : <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>}
      </div>
      <div>
        <h2>Price Alerts</h2>
        {/* TODO: List alerts here */}
        {alerts.length === 0 ? <p>No alerts set yet.</p> : <ul>{alerts.map(a => <li key={a.id}>{a.productName} - Target: ₹{a.targetPrice}</li>)}</ul>}
      </div>
    </div>
  );
}
