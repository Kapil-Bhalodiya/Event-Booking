import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    console.log("setData = ",userData);
    setUser(userData);
    localStorage.setItem('session', userData.token);
  };

  const logout = () => {
    setUser(null);
    console.log("User Logout : ",user);
    localStorage.removeItem('session');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
