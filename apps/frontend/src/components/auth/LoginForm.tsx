import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { login } from '../../api/auth';
import { cn } from '../../../lib/utils';
import clsx from 'clsx';

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
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 items-center'>
      <input
        type="email"
        className={cn(clsx('w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm dark:bg-neutral-900 dark:text-white dark:border-neutral-600', isFailedLogin ? 'border-red' : ''))}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        className={cn(clsx('w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm dark:bg-neutral-900 dark:text-white dark:border-neutral-600', isFailedLogin ? 'border-red' : ''))}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {
        isFailedLogin &&
        <span className='content-start text-red-500'>Invalid username or password</span>
      }
      <button
        type="submit"
        disabled={loading}
        className="bg-brand text-white px-4 py-2 rounded w-40 hover:bg-brand-dark"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
