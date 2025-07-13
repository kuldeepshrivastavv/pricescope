import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../src/supabaseClient';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!id) return;
    supabase.from('products').select('*').eq('id', id).single().then(({ data }) => setProduct(data));
    supabase.from('price_history').select('*').eq('product_id', id).order('timestamp', { ascending: true }).then(({ data }) => setHistory(data || []));
  }, [id]);

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      {product ? (
        <>
          <h1>{product.name}</h1>
          <img src={product.image} alt={product.name} width={100} />
          <p>{product.ai_caption}</p>
          <h2>Price History</h2>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={v => v && v.slice(5, 10)} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : <p>Loading...</p>}
    </div>
  );
}
