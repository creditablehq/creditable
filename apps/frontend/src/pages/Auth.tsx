import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import { cn } from '../../lib/utils';

const Auth = () => {
  const { token } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  if (token) {
    return null; // Don't render if already authenticated
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/creditablelogo_nobackground.png"
            alt="Creditable"
            className="h-12 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Welcome to Creditable
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            {authMode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 p-8">
          {/* Tab Switcher */}
          <div className="flex rounded-lg bg-neutral-100 dark:bg-neutral-700 p-1 mb-6">
            <button
              onClick={() => setAuthMode('login')}
              className={cn(
                'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
                authMode === 'login'
                  ? 'bg-white dark:bg-neutral-600 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              )}
            >
              Sign In
            </button>
            {/* TODO: remove when Sign Up enabled */}
            {/* <button
              onClick={() => setAuthMode('signup')}
              className={cn(
                'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
                authMode === 'signup'
                  ? 'bg-white dark:bg-neutral-600 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              )}
            >
              Sign Up
            </button> */}
          </div>

          {/* Form */}
          {authMode === 'login' ? <LoginForm /> : <SignupForm />}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-neutral-500 dark:text-neutral-400">
          <p>Not a member? <a href="https://joincreditable.com/book-a-demo#contact" target="_blank">Book a demo!</a></p>
          <p>© 2026 Creditable. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
