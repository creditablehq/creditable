import { getAuthToken } from '../../lib/authToken';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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
