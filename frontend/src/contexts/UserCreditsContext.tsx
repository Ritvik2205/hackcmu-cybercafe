import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@clerk/clerk-react';

interface UserCreditsContextType {
  credits: number;
  setCredits: (credits: number) => void;
  updateCredits: (newCredits: number) => void;
  isLoading: boolean;
  refreshCredits: () => Promise<void>;
}

const UserCreditsContext = createContext<UserCreditsContextType | undefined>(undefined);

interface UserCreditsProviderProps {
  children: ReactNode;
}

export const UserCreditsProvider: React.FC<UserCreditsProviderProps> = ({ children }) => {
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { getToken, isSignedIn } = useAuth();

  const fetchUserCredits = async () => {
    if (!isSignedIn) {
      setCredits(0);
      setIsLoading(false);
      return;
    }

    try {
      const clerkToken = await getToken();
      if (!clerkToken) {
        setCredits(0);
        setIsLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8000/get_credits/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ account: clerkToken }),
      });

      if (response.ok) {
        const data = await response.json();
        setCredits(data.credits || data.total_credits || 0);
      } else {
        console.error('Failed to fetch user credits');
        setCredits(0);
      }
    } catch (error) {
      console.error('Error fetching user credits:', error);
      setCredits(0);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCredits = (newCredits: number) => {
    setCredits(newCredits);
  };

  const refreshCredits = async () => {
    setIsLoading(true);
    await fetchUserCredits();
  };

  useEffect(() => {
    fetchUserCredits();
  }, [isSignedIn]);

  const value: UserCreditsContextType = {
    credits,
    setCredits,
    updateCredits,
    isLoading,
    refreshCredits,
  };

  return (
    <UserCreditsContext.Provider value={value}>
      {children}
    </UserCreditsContext.Provider>
  );
};

export const useUserCredits = (): UserCreditsContextType => {
  const context = useContext(UserCreditsContext);
  if (context === undefined) {
    throw new Error('useUserCredits must be used within a UserCreditsProvider');
  }
  return context;
};

export default UserCreditsContext;
