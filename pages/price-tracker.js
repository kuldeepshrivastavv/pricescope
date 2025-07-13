import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const mockHistory = [
  { date: '2024-07-01', price: 1999 },
  { date: '2024-07-05', price: 1899 },
  { date: '2024-07-10', price: 1799 },
  { date: '2024-07-15', price: 1699 },
];

export default function PriceTracker() {
  const [products, setProducts] = useState([
    { name: 'iPhone 15', url: 'https://apple.com', price: 1999, history: mockHistory },
  ]);
  const [form, setForm] = useState({ name: '', url: '', price: '' });

  const addProduct = (e) => {
    e.preventDefault();
    setProducts([
      ...products,
      { ...form, price: Number(form.price), history: mockHistory },
    ]);
    setForm({ name: '', url: '', price: '' });
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h1>📊 Price Tracker</h1>
      <form onSubmit={addProduct} style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="url"
          placeholder="Product URL"
          value={form.url}
          onChange={e => setForm({ ...form, url: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Initial Price"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
          required
        />
        <button type="submit">Add Product</button>
      </form>
      <ul>
        {products.map((product, idx) => (
          <li key={idx} style={{ marginBottom: 32, border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
            <h2>{product.name}</h2>
            <a href={product.url} target="_blank" rel="noopener noreferrer">View Product</a>
            <p>Current Price: ₹{product.price}</p>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={product.history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
