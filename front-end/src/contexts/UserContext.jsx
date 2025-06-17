import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { useAuth } from "./AuthContext";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const { isLoggedIn } = useAuth();
  
  // O carrinho continua sendo gerenciado no cliente para uma melhor experiência.
  // Ele é salvo no localStorage para não ser perdido ao recarregar a página.
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Erro ao ler carrinho do localStorage", error);
      return [];
    }
  });
  
  useEffect(() => {
    // Persiste o carrinho no localStorage sempre que ele for alterado.
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Limpa o carrinho quando o usuário faz logout.
  useEffect(() => {
    if (!isLoggedIn) {
      setCartItems([]);
      localStorage.removeItem('cartItems');
    }
  }, [isLoggedIn]);

  // --- LÓGICA DO CARRINHO (CLIENT-SIDE) ---
  const addCart = (product, quantity) => {
    setCartItems(prevItems => {
      const exist = prevItems.find(item => item._id === product._id);
      if (exist) {
        // Se o item já existe, atualiza a quantidade
        return prevItems.map(item =>
          item._id === product._id 
          ? { ...item, quantity: Math.min(item.quantity + quantity, product.inStock) } 
          : item
        );
      } else {
        // Se é um item novo, adiciona ao carrinho
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const updateCart = (productId, quantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === productId ? { ...item, quantity: Number(quantity) } : item
      )
    );
  };
  
  const deleteCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };
  
  const clearCart = () => {
    setCartItems([]);
  }

  // --- FUNÇÕES QUE CHAMAM A API (BACK-END) ---
  // Note como elas são simples. Apenas chamam o apiClient.
  
  const updateUserProfile = async (newUserData) => apiClient('/users/profile', {
    method: 'PUT',
    body: newUserData
  });
  
  const getMyOrders = async () => apiClient('/orders/myorders');
  
  const addOrder = async (orderData) => apiClient('/orders', { 
    method: 'POST', 
    body: orderData 
  });
  
  const getMyAddresses = async () => apiClient('/addresses');
  const addAddress = async (addressData) => apiClient('/addresses', { method: 'POST', body: addressData });
  const updateAddress = async (id, addressData) => apiClient(`/addresses/${id}`, { method: 'PUT', body: addressData });
  const removeAddress = async (id) => apiClient(`/addresses/${id}`, { method: 'DELETE' });
  
  const getMyCards = async () => apiClient('/cards');
  const addCard = async (cardData) => apiClient('/cards', { method: 'POST', body: cardData });
  const removeCard = async (id) => apiClient(`/cards/${id}`, { method: 'DELETE' });

  // Funções de admin (exemplo)
  const getAllUsersAdmin = async () => apiClient('/users/admin/all');
  const deleteUserAdmin = async (id) => apiClient(`/users/admin/${id}`, { method: 'DELETE' });


  const value = {
    // Carrinho
    cartItems,
    addCart,
    updateCart,
    deleteCart,
    clearCart,
    cartQuantity: cartItems.length,

    // Ações da API
    updateUserProfile,
    getMyOrders,
    addOrder,
    getMyAddresses,
    addAddress,
    updateAddress,
    removeAddress,
    getMyCards,
    addCard,
    removeCard,
    // Funções de Admin
    getAllUsersAdmin,
    deleteUserAdmin
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
}