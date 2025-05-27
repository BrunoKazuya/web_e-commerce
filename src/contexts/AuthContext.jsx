import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

const AuthContext = createContext();


export function AuthProvider({ children }) {
  const {setCartQuantity} = useUser()
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("loggedIn") === "true"
  });
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('loggedIn');
    if (stored === 'true') {
      setIsLoggedIn(true);
      const userStored = localStorage.getItem("user");
      const user = JSON.parse(userStored)
      if(user.role === 'admin'){
        setIsAdmin(true)
      } else{
        setIsAdmin(false)
      }
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
      setCartQuantity(user.cart.length)
      setIsLoggedIn(true)
      if(user.role === 'admin'){
        setIsAdmin(true)
      } else{
        setIsAdmin(false)
      }
      return true
    }
    return false
  }

  function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('user')
    setIsLoggedIn(false);
    setCartQuantity(0)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

// 6. Hook para usar o AuthContext
export function useAuth() {
  return useContext(AuthContext);
}