const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
export async function pingBackend() {
  const res = await fetch(`${API_BASE_URL}/ping`);
  if (!res.ok) throw new Error('Backend not reachable');
  return res.json();
}
