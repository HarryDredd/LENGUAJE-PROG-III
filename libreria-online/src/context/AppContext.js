// src/context/AppContext.js
import React, { createContext, useState } from 'react';
// hacer el contexto
export const AppContext = createContext();

// Hacemos el proveedor del contexto
export const AppProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [resultTitle, setResultTitle] = useState('');

  return (
    <AppContext.Provider value={{ searchTerm, setSearchTerm, resultTitle, setResultTitle }}>
      {children}
    </AppContext.Provider>
  );
};