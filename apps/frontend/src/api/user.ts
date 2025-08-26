import { getAuthToken } from '../../lib/authToken';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function getMe() {
  const token = getAuthToken();

  if (token) {
    const res = await fetch(`${API_BASE_URL}/user/me`, {
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
