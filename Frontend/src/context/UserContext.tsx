import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

// Define the shape of the user object
interface User {
  id:string;
  name: string;
  email: string;
  image: string;
}

// Define the context shape
interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  fetchUserData: () => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Props for provider
interface UserProviderProps {
  children: ReactNode;
}

// Provider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUserData = async () => {
    try {
      const response = await axios.get<{ user: User }>(`${import.meta.env.VITE_BackendURL}/api/user/get-user`, {
        withCredentials: true,
      });
      setUser(response.data.user);

      console.log(response);
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BackendURL}/api/user/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }

    alert("User Logged Out Successfully");
  };

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserData, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
