import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [cartQuantity, setCartQuantity] = useState(() => {
    return getCart().length;
  });
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
        phone: "(11)987654321",
        createdAt: Date.now(),
        cart: [],
        order: [],
        address: [],
        card: [],
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
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  }

  function updateUser(newUser, mine) {
    if (mine) {
      const user = getUser();
      if (!(user.email === newUser.email) && !isEmailValid(newUser.email)) {
        return false;
      }
      const updatedUser = {
        ...user,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      saveUsers(updatedUser);
    } else {
      const user = getUserById(newUser.id);
      const updatedUser = { ...user, role: newUser.role };
      saveUsers(updatedUser);
    }

    return true;
  }

  function saveUsers(user) {
    const users = getUsers();
    const updateUsers = users.map((u) => {
      if (u.id === user.id) {
        return user;
      }
      return u;
    });
    localStorage.setItem("users", JSON.stringify(updateUsers));
  }

  function removeUser(id) {
    const users = getUsers();
    localStorage.setItem(
      "users",
      JSON.stringify(users.filter((u) => u.id !== id))
    );
  }

  function getUserById(id) {
    const users = getUsers();
    return users.find((u) => u.id === id);
  }

  function updatePasswordUser(newPassword) {
    const user = getUser();
    const updatedUser = { ...user, password: newPassword };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    const users = getUsers();
    const updateUsers = users.map((u) => {
      if (u.id === updatedUser.id) {
        return updatedUser;
      }
      return u;
    });
    localStorage.setItem("users", JSON.stringify(updateUsers));
  }

  function verifyPassword(password) {
    const user = getUser();
    if (user.password === password) {
      return true;
    }
    return false;
  }

  function isEmailValid(email) {
    const stored = localStorage.getItem("users");
    const users = JSON.parse(stored);

    const user = users.find((u) => u.email === email);
    if (user) {
      return false;
    }
    return true;
  }

  function getUser() {
    const stored = localStorage.getItem("user");

    return JSON.parse(stored);
  }

  function getUsers() {
    const stored = localStorage.getItem("users");

    return JSON.parse(stored);
  }

  function addCart(product, quantity) {
    const user = getUser();
    const productCart = user.cart.find((p) => p.id === product.id);
    if (productCart) {
      if (productCart.quantity + quantity > productCart.inStock) {
        productCart.quantity = productCart.inStock;
      } else {
        productCart.quantity = productCart.quantity + quantity;
      }
      user.cart.map((p) => {
        if (p.id === productCart.id) {
          return productCart;
        }
        return p;
      });
    } else {
      setCartQuantity(cartQuantity + 1);
      product = { ...product, quantity: quantity };
      user.cart.push(product);
    }
    localStorage.setItem("user", JSON.stringify(user));
    const users = getUsers();
    const updateUsers = users.map((u) => {
      if (u.id === user.id) {
        return user;
      }
      return u;
    });
    localStorage.setItem("users", JSON.stringify(updateUsers));
  }

  function updateCart(product, quantity) {
    const user = getUser();
    const productCart = user.cart.find((p) => p.id === product.id);
    if (productCart) {
      productCart.quantity = quantity;
    }
    user.cart.map((p) => {
      if (p.id === productCart.id) {
        return productCart;
      }
      return p;
    });
    localStorage.setItem("user", JSON.stringify(user));
    const users = getUsers();
    const updateUsers = users.map((u) => {
      if (u.id === user.id) {
        return user;
      }
      return u;
    });
    localStorage.setItem("users", JSON.stringify(updateUsers));
  }

  function deleteCart(id) {
    const user = getUser();
    const productCart = user.cart.filter((p) => p.id !== id);
    user.cart = productCart;
    localStorage.setItem("user", JSON.stringify(user));
    const users = getUsers();
    users.map((u) => {
      if (u.id === user.id) {
        return user;
      }
      return u;
    });
    localStorage.setItem("users", JSON.stringify(users));
    setCartQuantity(cartQuantity - 1);
  }

  function getOrder() {
    const user = getUser();
    return user.order;
  }

  function addOrder(order) {
    const user = getUser();
    user.order.push(order);
    user.cart = [];
    localStorage.setItem("user", JSON.stringify(user));
    const users = getUsers();
    const updateUsers = users.map((u) => {
      if (u.id === user.id) {
        return user;
      }
      return u;
    });
    localStorage.setItem("users", JSON.stringify(updateUsers));
  }

  function getCart() {
    const user = getUser();
    if (!user) return [];
    return user.cart;
  }

  function getAddress() {
    const user = getUser();
    return user.address;
  }

  function addAddress(address) {
    const user = getUser();
    user.address.push(address);
    localStorage.setItem("user", JSON.stringify(user));
    const users = getUsers();
    const updateUsers = users.map((u) => {
      if (u.id === user.id) {
        return user;
      }
      return u;
    });
    localStorage.setItem("users", JSON.stringify(updateUsers));
  }

  function updateAddress(address) {
    const user = getUser();
    const newAddress = user.address.map((a) => {
      if (a.id === address.id) return address;
      return a;
    });
    user.address = newAddress;
    localStorage.setItem("user", JSON.stringify(user));
    const users = getUsers();
    const updateUsers = users.map((u) => {
      if (u.id === user.id) {
        return user;
      }
      return u;
    });
    localStorage.setItem("users", JSON.stringify(updateUsers));
  }

  function removeAddress(id) {
    const user = getUser();
    const newAddress = user.address.filter((a) => a.id !== id);
    user.address = newAddress;
    localStorage.setItem("user", JSON.stringify(user));
    const users = getUsers();
    const updateUsers = users.map((u) => {
      if (u.id === user.id) {
        return user;
      }
      return u;
    });
    localStorage.setItem("users", JSON.stringify(updateUsers));
  }

  function getCard() {
  const user = getUser();
  return user.card;
  }

function addCard(card) {
  const user = getUser();
  if (!user.card) user.card = [];
  card.id = user.card.length + 1;
  user.card.push(card);
  localStorage.setItem("user", JSON.stringify(user));

  const users = getUsers();
  const updateUsers = users.map(u => u.id === user.id ? user : u);
  localStorage.setItem("users", JSON.stringify(updateUsers));
}

function updateCard(card) {
  const user = getUser();
  if (!user.card) user.card = [];
  user.card = user.card.map(c => c.id === card.id ? card : c);
  localStorage.setItem("user", JSON.stringify(user));

  const users = getUsers();
  const updateUsers = users.map(u => u.id === user.id ? user : u);
  localStorage.setItem("users", JSON.stringify(updateUsers));
}

function removeCard(id) {
  const user = getUser();
  if (!user.card) user.card = [];
  user.card = user.card.filter(c => c.id !== id);
  localStorage.setItem("user", JSON.stringify(user));

  const users = getUsers();
  const updateUsers = users.map(u => u.id === user.id ? user : u);
  localStorage.setItem("users", JSON.stringify(updateUsers));
}


  return (
    <UserContext.Provider
      value={{
        addUser,
        isEmailValid,
        getUser,
        addCart,
        getCart,
        updateCart,
        deleteCart,
        cartQuantity,
        setCartQuantity,
        getOrder,
        addOrder,
        updateUser,
        updatePasswordUser,
        verifyPassword,
        getAddress,
        addAddress,
        updateAddress,
        removeAddress,
        getUsers,
        removeUser,
        getUserById,
        getCard,
        addCard,
        updateCard,
        removeCard,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// 6. Hook para usar o AuthContext
export function useUser() {
  return useContext(UserContext);
}
