let token: string | null = null;

// Hydrate token from localStorage immediately
if (typeof window !== 'undefined') {
  const savedToken = localStorage.getItem('token');
  if (savedToken) token = savedToken;
}

export function setAuthToken(newToken: string | null) {
  token = newToken;

  if (typeof window !== 'undefined') {
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  }
}

export function getAuthToken(): string | null {
  return token;
}
