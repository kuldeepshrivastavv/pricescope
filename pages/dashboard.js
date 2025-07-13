import { useEffect, useState } from 'react';
import { supabase } from '../src/supabaseClient';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [form, setForm] = useState({ url: '', name: '', image: '', ai_caption: '' });
  const [loading, setLoading] = useState(false);
  const [captionLoading, setCaptionLoading] = useState(false);

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
      if (user) fetchProducts(user.id);
    });
    // TODO: Fetch alerts from Supabase
  }, []);

  const fetchProducts = async (user_id) => {
    let { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });
    if (!error) setProducts(data);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock metadata and AI caption (replace with real fetch/AI call later)
    const name = form.name || 'Sample Product';
    const image = form.image || 'https://via.placeholder.com/100';
    const ai_caption = form.ai_caption || 'This is an AI-generated caption.';
    const { error } = await supabase.from('products').insert([
      {
        url: form.url,
        name,
        image,
        ai_caption,
        user_id: user.id,
      },
    ]);
    setLoading(false);
    if (!error) {
      setForm({ url: '', name: '', image: '', ai_caption: '' });
      fetchProducts(user.id);
    } else {
      alert('Error adding product: ' + error.message);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Dashboard</h1>
      {user && (
        <div className="mb-6 bg-white dark:bg-zinc-900 rounded-lg p-4 shadow flex items-center justify-between">
          <div>
            <div className="font-semibold text-lg">Welcome, <span className="text-primary">{user.email}</span></div>
            <div className="text-xs text-zinc-500">User ID: {user.id}</div>
          </div>
          <button
            className="px-3 py-1 rounded bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:scale-105 transition"
            onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login'; }}
          >Logout</button>
        </div>
      )}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Add Product</h2>
        <form onSubmit={handleAddProduct} className="flex flex-wrap gap-2 items-center mb-4">
          <input
            type="url"
            placeholder="Product URL"
            value={form.url}
            onChange={e => {
              const url = e.target.value;
              setForm(f => ({ ...f, url }));
              // Mock: auto-fill name/image/price for demo
              if (url.includes('amazon')) {
                setForm(f => ({
                  ...f,
                  name: 'Amazon Product',
                  image: 'https://m.media-amazon.com/images/I/71K7Q4P8VwL._SX679_.jpg',
                }));
              } else if (url.includes('flipkart')) {
                setForm(f => ({
                  ...f,
                  name: 'Flipkart Product',
                  image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/6/n/j/-original-imagwzrg6h9gghbz.jpeg',
                }));
              }
            }}
            required
            style={{ marginRight: 8 }}
          />
          <input
            type="text"
            placeholder="Product Name (optional)"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={{ marginRight: 8 }}
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={form.image}
            onChange={e => setForm({ ...form, image: e.target.value })}
            style={{ marginRight: 8 }}
          />
          <input
            type="text"
            placeholder="AI Caption (optional)"
            value={form.ai_caption}
            onChange={e => setForm({ ...form, ai_caption: e.target.value })}
            style={{ marginRight: 8 }}
          />
          <button
            type="button"
            onClick={async () => {
              setCaptionLoading(true);
              // Mock AI caption, replace with real API call
              setTimeout(() => {
                setForm(f => ({ ...f, ai_caption: `AI summary for: ${form.name || 'Product'}` }));
                setCaptionLoading(false);
              }, 1000);
            }}
            disabled={captionLoading}
            style={{ marginRight: 8 }}
          >
            {captionLoading ? 'Generating...' : 'Generate AI Caption'}
          </button>
          <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Product'}</button>
        </form>
        <h2 className="text-xl font-bold mb-2">Tracked Products</h2>
        {products.length === 0 ? <p className="text-zinc-500">No products tracked yet.</p> : <ul className="space-y-2">{products.map(p => <li key={p.id} className="flex items-center bg-white dark:bg-zinc-900 rounded-lg p-3 shadow">
          <a href={`/product/${p.id}`} className="font-bold text-primary hover:underline text-lg">{p.name}</a>
          <img src={p.image} alt={p.name} width={40} className="rounded ml-4" />
          <span className="italic ml-4 text-zinc-500">{p.ai_caption}</span>
        </li>)}</ul>}
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Price Alerts</h2>
        {/* TODO: List alerts here */}
        {alerts.length === 0 ? <p className="text-zinc-500">No alerts set yet.</p> : <ul>{alerts.map(a => <li key={a.id}>{a.productName} - Target: ₹{a.targetPrice}</li>)}</ul>}
      </div>
    </div>
  );
}
