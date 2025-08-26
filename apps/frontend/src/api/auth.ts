const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface SignUpData {
  email: string;
  password: string;
  name: string;
  brokerId?: string; // Optional, for now
}

export async function signUp(data: SignUpData) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
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
  try {
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
  } catch (e: any) {
    console.error('Error on login: ', e?.message);
    throw e;
  }
}

export async function updateUser(id: string, data: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/update-user/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to update user');
    }

    return res.json();
  } catch (e: any) {
    console.error('Error updating user: ', e);
    throw e;
  }
}
