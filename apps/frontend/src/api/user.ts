import { getAuthToken } from '../../lib/authToken';
import { UserFormData } from '../types/User';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function getMe() {
  const token = getAuthToken();

  if (token) {
    const res = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch user /me');
    }

    return res.json();
  }
}

export async function createUser(data: UserFormData) {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to create user');
  }

  return res.json();
}
