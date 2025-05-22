import { createContext, useState } from 'react';

export const AuthContext = createContext({
  logged: false,
  setLogged: () => {}
});

export function AuthProvider({ children }) {
  const [logged, setLogged] = useState(false);
  return (
    <AuthContext.Provider value={{ logged, setLogged }}>
      {children}
    </AuthContext.Provider>
  );
}