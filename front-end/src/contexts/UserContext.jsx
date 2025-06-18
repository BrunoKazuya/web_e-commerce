import { createContext, useContext, useState, useEffect } from "react"; // Imports React hooks.
import apiClient from "../utils/apiClient"; // Imports the API client.
import { useAuth } from "./AuthContext"; // Imports the auth hook to check login status.

const UserContext = createContext(null); // Creates a new context for user-related data and actions.

export function UserProvider({ children }) { // Defines the UserProvider component.
  const { isLoggedIn } = useAuth(); // Gets the login status from the AuthContext.
  
  // The cart is still managed on the client-side for a better experience.
  // It is saved to localStorage so it isn't lost on page reload.
  const [cartItems, setCartItems] = useState(() => { // Initializes cart state from localStorage.
    try {
      const savedCart = localStorage.getItem('cartItems'); // Tries to get the cart from localStorage.
      return savedCart ? JSON.parse(savedCart) : []; // Parses it if it exists, otherwise returns an empty array.
    } catch (error) {
      console.error("Erro ao ler carrinho do localStorage", error); // Logs an error if parsing fails.
      return []; // Returns an empty array as a fallback.
    }
  });
  
  useEffect(() => { // Effect to persist cart changes.
    // Persists the cart to localStorage whenever it is changed.
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]); // Runs whenever the cartItems state changes.
  
  // Clears the cart when the user logs out.
  useEffect(() => {
    if (!isLoggedIn) { // Checks if the user is no longer logged in.
      setCartItems([]); // Clears the cart from the state.
      localStorage.removeItem('cartItems'); // Removes the cart from localStorage.
    }
  }, [isLoggedIn]); // Runs whenever the isLoggedIn status changes.

  // --- CART LOGIC (CLIENT-SIDE) ---
  const addCart = (product, quantity) => {
    setCartItems(prevItems => {
      const exist = prevItems.find(item => item._id === product._id); // Checks if the item is already in the cart.
      if (exist) {
        // If the item exists, update its quantity.
        return prevItems.map(item =>
          item._id === product._id 
          ? { ...item, quantity: Math.min(item.quantity + quantity, product.inStock) } // Caps quantity at the available stock.
          : item
        );
      } else {
        // If it's a new item, add it to the cart.
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const updateCart = (productId, quantity) => { // Function to update the quantity of a specific item.
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === productId ? { ...item, quantity: Number(quantity) } : item
      )
    );
  };
  
  const deleteCart = (productId) => { // Function to remove an item from the cart.
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };
  
  const clearCart = () => { // Function to completely clear the cart.
    setCartItems([]);
  }

  // --- FUNCTIONS THAT CALL THE API (BACK-END) ---
  // Note how simple they are. They just call the apiClient.
  
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

  // Admin functions (example)
  const getAllUsersAdmin = async () => apiClient('/users/admin/all');
  const deleteUserAdmin = async (id) => apiClient(`/users/admin/${id}`, { method: 'DELETE' });


  const value = { // The comprehensive value object provided by the context.
    // Cart
    cartItems,
    addCart,
    updateCart,
    deleteCart,
    clearCart,
    cartQuantity: cartItems.reduce((acc, item) => acc + item.quantity, 0),

    // API Actions
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
    // Admin Functions
    getAllUsersAdmin,
    deleteUserAdmin
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() { // Defines the custom useUser hook.
  const context = useContext(UserContext);
  if (context === null) { // Checks if used outside a provider.
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
}