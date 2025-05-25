import { createContext, useContext, useState, useEffect } from 'react';


const AuthContext = createContext();


export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("loggedIn") === "true"
  });


  useEffect(() => {
    const stored = localStorage.getItem('loggedIn');
    if (stored === 'true') {
      setIsLoggedIn(true);
    }
  }, []);


  function login(email, password) {
    const stored = localStorage.getItem("users")
    const users = JSON.parse(stored)

    const user = users.find(u =>
    u.email === email && u.password === password)
    if(user){
      localStorage.setItem('loggedIn', 'true')
      localStorage.setItem('user', JSON.stringify(user))
      setIsLoggedIn(true)
      return true
    }
    return false
  }

  function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('user')
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 6. Hook para usar o AuthContext
export function useAuth() {
  return useContext(AuthContext);
}