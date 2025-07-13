import { useState } from 'react';
import { supabase } from '../src/supabaseClient';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged in successfully!');
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-700">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Login</h1>
      <form onSubmit={handleLogin} className="bg-white dark:bg-zinc-900 shadow-lg rounded-xl p-8 w-full max-w-sm space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-primary"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-primary"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-2 rounded bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:scale-105 transition"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="text-center text-sm mt-2">
          Don&apos;t have an account? <a href="/signup" className="text-primary underline">Sign up</a>
        </div>
      </form>
    </div>
  );
}
