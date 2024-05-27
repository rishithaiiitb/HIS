import React, { createContext, useContext, useState } from 'react';

const ConsentContext = createContext(null);

export const useConsent = () => useContext(ConsentContext);

export const ConsentProvider = ({ children }) => {
  const [consentToken , setConsentToken] = useState(null);

  const updateConsent = (consent) => {
    setConsentToken(consent);
  };

  return (
    <ConsentContext.Provider value={{ consentToken , updateConsent }}>
      {children}
    </ConsentContext.Provider>
  );
};
