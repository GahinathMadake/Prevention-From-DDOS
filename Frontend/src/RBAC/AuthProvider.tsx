import React, { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { fetchUserData } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      await fetchUserData();
      setLoading(false);
    };
    initAuth();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">Loading user session...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
