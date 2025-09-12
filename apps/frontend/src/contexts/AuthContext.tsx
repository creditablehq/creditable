import { createContext, useEffect, useState, useContext, ReactNode } from 'react';
import { setAuthToken } from '../../lib/authToken';

interface AuthContextType {
  token: string | null;
  setToken: (token: string) => void;
  setUser: (user: any) => void;
  user: any | null;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const parseJwt = (token: string) => {
  try {
    if (token !== null && token !== undefined) {
      return JSON.parse(atob(token.split('.')[1]));
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setTokenState] = useState<string | null>(() => {
    const savedToken = localStorage.getItem('token');
    return savedToken ? savedToken : null;
  });
  const [user, setUserState] = useState<any | null>(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser !== undefined && savedUser !== null) {
      return JSON.parse(savedUser)
    } else {
      return null
    }
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('token') || '';
    const decodedJwt = parseJwt(storedToken);

    // Check if the token has expired
    if (decodedJwt && decodedJwt.exp * 1000 < Date.now()) {
      logout();
      localStorage.clear();
      location.reload();
    } else if (storedToken) {
      setTokenState(storedToken);
      setAuthToken(storedToken);
    }

  }, [token]);

  useEffect(() => {
    localStorage.setItem('token', token ?? '');
    setAuthToken(token);
    localStorage.setItem('user', JSON.stringify(user));
  }, [token, user]);

  const setToken = (newToken: string) => {
    setTokenState(newToken);
    setAuthToken(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  const setUser = (user: any) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      setUserState(user);
    } else {
      localStorage.removeItem('user');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setTokenState(null);
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useFetch = (url: string, options: any) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          if (response.status === 401) {
            setAuthToken(null);
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, options]); // Dependencies to re-run effect

  return { data, loading, error };
}
