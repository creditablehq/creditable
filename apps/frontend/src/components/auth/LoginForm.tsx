import React, { useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import { login } from '../../api/auth';

const LoginForm = () => {
  const { setToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      login({ email, password }).then(res => {
        setToken(res?.token);
      });
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 items-center'>
      <input
        type="email"
        className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm dark:bg-neutral-900 dark:text-white dark:border-neutral-600"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm dark:bg-neutral-900 dark:text-white dark:border-neutral-600"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button
        type="submit"
        className="bg-brand text-white px-4 py-2 rounded w-40 hover:bg-brand-dark"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
