import { getAuthToken } from '../../lib/authToken';
import { Company } from '../types/Company';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function createCompany(data: { name: string }) {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/companies`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to create company');
  }

  return res.json(); // Returns created company object
}

export async function getCompanies() {
  const token = getAuthToken();
  if (token) {
    const res = await fetch(`${API_BASE_URL}/companies`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch companies');
    }

    return res.json();
  } else return [];
}

export async function getCompanyById(id: string) {
  const token = getAuthToken();
  if (token) {
    const res = await fetch(`${API_BASE_URL}/companies/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Failed to fetch company');
    return res.json();
  }
}

export async function updateCompanyById(id: string, companyData: Company) {
  const token = getAuthToken();

  if (token) {
    const res = await fetch(`${API_BASE_URL}/companies/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(companyData),
    });

    if (!res.ok) {
      throw new Error('Failed to update company');
    }

    return res.json();
  }
}
