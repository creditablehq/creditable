const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface SignUpData {
  email: string;
  password: string;
  name: string;
  brokerId?: string; // Optional, for now
}

export async function signUp(data: SignUpData) {
  const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to sign up');
  }

  return res.json(); // This should return the JWT token
}

interface LoginData {
  email: string;
  password: string;
}

export async function login(data: LoginData) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to login');
  }

  return res.json(); // This should return the JWT token
}
