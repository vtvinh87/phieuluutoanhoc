import React, { createContext, useState, ReactNode, useContext } from 'react';
import { UserView } from '../types';

interface UserContextType {
  view: UserView;
  setView: (view: UserView) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [view, setView] = useState<UserView>(UserView.STUDENT);

  return (
    <UserContext.Provider value={{ view, setView }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
