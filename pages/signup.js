import { useState } from 'react';
import { supabase } from '../src/supabaseClient';
import toast from 'react-hot-toast';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Signup successful! Check your email to confirm.');
      window.location.href = '/login';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-700">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Sign Up</h1>
      <form onSubmit={handleSignup} className="bg-white dark:bg-zinc-900 shadow-lg rounded-xl p-8 w-full max-w-sm space-y-4">
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
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        <div className="text-center text-sm mt-2">
          Already have an account? <a href="/login" className="text-primary underline">Login</a>
        </div>
      </form>
    </div>
  );
}
