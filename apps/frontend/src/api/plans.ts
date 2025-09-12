import { getAuthToken } from '../../lib/authToken';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function getPlansByCompany(companyId: string) {
  const token = getAuthToken();

  if (token) {
    const res = await fetch(`${API_BASE_URL}/companies/${companyId}/plans`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch plans');
    }

    return res.json();
  } else return [];
}

export async function createPlan(companyId: string, data: any) {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/companies/${companyId}/plans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create plan');
  }

  return res.json();
}

export async function getReport(id: string, action: 'view' | 'download') {
  if (!action) throw new Error('Failed to fetch report, no action specified.');

  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/plans/${id}/report`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      'Failed to fetch report: ' + error.message || 'Failed to fetch report'
    );
  }

  if (action === 'download') {
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `plan-report-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  }

  if (action === 'view') {
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
}
