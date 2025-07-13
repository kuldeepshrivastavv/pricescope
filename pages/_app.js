import '../styles/globals.css';
import { useState, useEffect } from 'react';

export default function MyApp({ Component, pageProps }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <div className={dark ? 'dark bg-black min-h-screen' : 'bg-white min-h-screen'}>
      <nav className="crazy-gradient text-white px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-xl tracking-tight">Pricescope</div>
        <div className="space-x-4">
          <a href="/dashboard" className="hover:underline">Dashboard</a>
          <a href="/alerts" className="hover:underline">Alerts</a>
          <a href="/account" className="hover:underline">Account</a>
        </div>
        <button
          className="ml-4 px-3 py-1 rounded bg-white/20 hover:bg-white/40 transition text-white border border-white"
          onClick={() => setDark(d => !d)}
        >
          {dark ? '🌙' : '☀️'}
        </button>
      </nav>
      <main className="max-w-3xl mx-auto p-4">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
