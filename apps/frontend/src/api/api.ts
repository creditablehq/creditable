export async function pingBackend() {
  const res = await fetch(`/api/ping`);
  if (!res.ok) throw new Error('Backend not reachable');
  return res.json();
}
