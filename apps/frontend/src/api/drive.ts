import { getAuthToken } from '../../lib/authToken';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function uploadFileToGoogleDrive(file: File) {
  const token = getAuthToken();
  const formData = new FormData();

  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/drive/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload file');
  }

  return res.json();
}
