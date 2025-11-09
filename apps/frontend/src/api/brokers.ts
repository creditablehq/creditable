import { getAuthToken } from '../../lib/authToken';
import { Broker } from '../types/Broker';
import { BrokerFormInput } from '../types/BrokerForm';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function getBrokers() {
  const token = getAuthToken();
  if (token) {
    const res = await fetch(`${API_BASE_URL}/brokers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch brokers');
    }

    return res.json();
  }
}

export async function createBroker(data: BrokerFormInput) {
  const token = getAuthToken();

  try {
    if (data) {
      const res = await fetch(`${API_BASE_URL}/brokers`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to create broker');
      }

      return res.json();
    }
  } catch (e: any) {
    console.error('Error creating broker: ', e);
    throw new Error('Error creating broker: ', e);
  }
}

export async function getBrokerById(id: string) {
  const token = getAuthToken();
  if (token) {
    const res = await fetch(`${API_BASE_URL}/brokers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch brokers');
    }

    return res.json();
  }
}

export async function updateBrokerById(id: string, brokerData: Broker) {
  const token = getAuthToken();

  if (token) {
    const res = await fetch(`${API_BASE_URL}/brokers/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(brokerData),
    });

    if (!res.ok) {
      throw new Error('Failed to update broker');
    }

    return res.json();
  }
}
