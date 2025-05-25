import { createContext, useContext, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  useEffect(() => {
    const stored = localStorage.getItem("users");

    if (!stored) {
      // 1. Define o usuário inicial como objeto
      const defaultUser = {
        id: 1,
        email: "admin@admin.com",
        password: "admin",
        role: "admin",
        name: "ADM",
      };

      // 2. Cria um array contendo esse objeto
      const users = [defaultUser];

      // 3. Serializa o array inteiro em JSON
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, []);

  function addUser(user) {
    const stored = localStorage.getItem("users");

    const users = stored ? JSON.parse(stored) : [];
    user.id = users.length + 1
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  }

  function isEmailValid(email){
    const stored = localStorage.getItem("users")
    const users = JSON.parse(stored)

    const user = users.find(u =>
    u.email === email)
    if(user){
      return false
    }
    return true
  }

  function getUser(){
    const stored = localStorage.getItem("user")

    return JSON.parse(stored)
  }

  return (
    <UserContext.Provider value={{ addUser, isEmailValid, getUser }}>{children}</UserContext.Provider>
  );

  

}

// 6. Hook para usar o AuthContext
export function useUser() {
  return useContext(UserContext);
}
