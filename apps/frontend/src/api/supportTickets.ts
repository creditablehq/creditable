import { getAuthToken } from '../../lib/authToken';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function getSupportTickets() {
  const token = getAuthToken();

  if (token) {
    const res = await fetch(`${API_BASE_URL}/supportTickets`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch feedback tickets');
    }

    return res.json();
  } else return [];
}

export async function createSupportTicket(data: {
  type: string;
  message: string;
}) {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/supportTickets`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to create support ticket');
  }

  return res.json();
}
