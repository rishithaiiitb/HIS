import React, { createContext, useContext, useState } from 'react';

const EmailContext = createContext(null);

export const useEmail = () => useContext(EmailContext);

export const EmailProvider = ({ children }) => {
  const [email, setEmail] = useState(null);

  const updateEmail = (email) => {
    setEmail(email);
  };

  return (
    <EmailContext.Provider value={{ email, updateEmail }}>
      {children}
    </EmailContext.Provider>
  );
};
