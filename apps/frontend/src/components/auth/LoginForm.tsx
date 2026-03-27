import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { login } from '../../api/auth';
import { cn } from '../../../lib/utils';

const LoginForm = () => {
  const { setToken, setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFailedLogin, setFailedLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    login({ email, password }).then(res => {
      setToken(res?.token);
      setUser(res?.user);
      setLoading(false);
    }).catch(err => {
      setFailedLogin(true);
      setLoading(false);
      console.error('Login failed:', err);
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Email address
        </label>
        <input
          type="email"
          id="email"
          className={cn(
            'w-full rounded-lg border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:text-white dark:border-neutral-600 dark:focus:ring-blue-400',
            isFailedLogin ? 'border-red-300 focus:ring-red-500' : 'border-neutral-300 dark:border-neutral-600'
          )}
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
          className={cn(
            'w-full rounded-lg border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:text-white dark:border-neutral-600 dark:focus:ring-blue-400',
            isFailedLogin ? 'border-red-300 focus:ring-red-500' : 'border-neutral-300 dark:border-neutral-600'
          )}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>
      {
        isFailedLogin &&
        <div className='text-red-600 dark:text-red-400 text-sm font-medium'>
          Invalid email or password
        </div>
      }
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
};

export default LoginForm;
