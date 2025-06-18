// src/contexts/AuthContext.jsx

import { createContext, useContext, useState, useEffect, useCallback } from 'react'; // Imports React hooks.
import apiClient from '../utils/apiClient'; // Imports a pre-configured API client.
import Loading from '../components/ui/Loading'; // Imports a loading spinner component.

const AuthContext = createContext(null); // Creates a new context for authentication.

export function AuthProvider({ children }) { // Defines the AuthProvider component that will wrap the application.
  const [user, setUser] = useState(null); // State to hold the authenticated user's data.
  const [status, setStatus] = useState('loading'); // State to track the authentication status: 'loading', 'authenticated', or 'unauthenticated'.

  // This function checks if the user has an active session on the backend.
  const checkUserStatus = useCallback(async () => { // useCallback to memoize the function.
    try {
      // The /profile route is protected. If it works, the cookie is valid.
      const userData = await apiClient('/users/profile'); // Tries to fetch the user profile.
      setUser(userData); // If successful, sets the user data.
      setStatus('authenticated'); // Sets the status to authenticated.
    // eslint-disable-next-line no-unused-vars
    } catch (error) { // Catches any error, e.g., a 401 Unauthorized if not logged in.
      // A 401 error is expected for a logged-out user.
      // We handle the error by setting the state to unauthenticated.
      setUser(null); // Clears any user data.
      setStatus('unauthenticated'); // Sets the status to unauthenticated.
    }
  }, []); // Empty dependency array means this function is created only once.

  // Runs the check once when the application loads.
  useEffect(() => { // Effect hook to run the check on initial component mount.
    checkUserStatus();
  }, [checkUserStatus]); // Depends on the memoized checkUserStatus function.

  // Login function.
  const login = async (email, password) => {
    try {
      const userData = await apiClient('/users/login', { // Makes a POST request to the login endpoint.
        method: 'POST',
        body: { email, password },
      });
      setUser(userData); // Sets the user data on successful login.
      setStatus('authenticated'); // Updates the status.
      return { success: true }; // Returns a success object.
    } catch (error) {
      return { success: false, message: error.message }; // Returns a failure object with the error message.
    }
  };
  
  // Register function.
  const register = async (name, email, password, phone) => {
    try {
      const userData = await apiClient('/users/register', { // Makes a POST request to the register endpoint.
        method: 'POST',
        body: { name, email, password, phone },
      });
      // After registering, the backend logs us in, so we update the state.
      setUser(userData); // Sets the user data.
      setStatus('authenticated'); // Updates the status.
      return { success: true }; // Returns a success object.
    } catch(error) {
      return { success: false, message: error.message }; // Returns a failure object.
    }
  }

  // Logout function.
  const logout = async () => {
    try {
      await apiClient('/users/logout', { method: 'POST' }); // Calls the logout endpoint.
    } finally { // The finally block ensures this code runs whether the try succeeds or fails.
      setUser(null); // Clears the user data.
      setStatus('unauthenticated'); // Sets the status to unauthenticated.
    }
  };

  const value = { // The value object that will be provided by the context.
    user,
    setUser,
    isLoggedIn: status === 'authenticated',
    isAdmin: user?.role === 'admin',
    authStatus: status,
    login,
    register,
    logout,
  };
  
  // Shows a general loading indicator while the initial session is being checked.
  if (status === 'loading') { // While the initial check is running...
    return <Loading size="lg" />; // Show a full-page loading indicator.
  }

  return ( // Once the status is determined, render the provider.
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to facilitate the use of the context.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() { // Defines the custom useAuth hook.
  const context = useContext(AuthContext); // Gets the context value.
  if (context === null) { // If the hook is used outside of an AuthProvider...
    throw new Error('useAuth deve ser usado dentro de um AuthProvider'); // Throw an error.
  }
  return context; // Otherwise, return the context value.
}