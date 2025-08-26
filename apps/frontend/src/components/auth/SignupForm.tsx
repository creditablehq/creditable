// src/components/SignupForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Import the custom auth hook
import { signUp } from '../../api/auth';

const SignupForm = () => {
  const { setToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await signUp({ email, password, name });

      if (response.token) {
        setToken(response.token); // Store the token in the context
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 items-center'>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <input
        type="text"
        className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm dark:bg-neutral-900 dark:text-white dark:border-neutral-600"
        id="name"
        value={name}
        placeholder='Name'
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm dark:bg-neutral-900 dark:text-white dark:border-neutral-600"
        id="email"
        value={email}
        placeholder='Email'
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm dark:bg-neutral-900 dark:text-white dark:border-neutral-600"
        id="password"
        value={password}
        placeholder='Password'
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-brand text-white px-4 py-2 rounded w-40 hover:bg-brand-dark"
      >
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignupForm;
