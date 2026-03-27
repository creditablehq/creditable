// src/components/SignupForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
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
    <form onSubmit={handleSubmit} className='space-y-6'>
      {error && (
        <div className='text-red-600 dark:text-red-400 text-sm font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-lg'>
          {error}
        </div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Full name
        </label>
        <input
          type="text"
          id="name"
          className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:text-white dark:border-neutral-600 dark:focus:ring-blue-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Email address
        </label>
        <input
          type="email"
          id="email"
          className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:text-white dark:border-neutral-600 dark:focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:text-white dark:border-neutral-600 dark:focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
};

export default SignupForm;
