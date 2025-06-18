import { createContext, useContext, useState, useEffect, useCallback } from "react"; // Imports React hooks.
import apiClient from "../utils/apiClient"; // Imports a pre-configured API client.

const ProductContext = createContext(null); // Creates a new context for product management.

export function ProductProvider({ children }) { // Defines the ProductProvider component.
  const [products, setProducts] = useState([]); // State to hold the list of products.
  const [categories, setCategories] = useState([]); // State to hold the list of categories.
  const [status, setStatus] = useState('idle'); // State to track the loading status of products.

  // The CHANGE IS HERE: the useCallback dependency array is empty.
  // This ensures the fetchProducts function is created only ONCE.
  const fetchProducts = useCallback(async () => { // Defines a memoized function to fetch products.
    setStatus('loading'); // Sets status to loading before the API call.
    try {
      const productsData = await apiClient('/products'); // Fetches product data.
      setProducts(productsData); // Sets the product data into state.
      setStatus('success'); // Sets status to success after the call.
    } catch (error) {
      console.error("Erro ao buscar produtos:", error); // Logs any error.
      setStatus('error'); // Sets status to error if the call fails.
    }
  }, []); // <--- EMPTY DEPENDENCY ARRAY makes this function stable.

  // The same change is applied here for fetchCategories.
  const fetchCategories = useCallback(async () => { // Defines a memoized function to fetch categories.
    try {
      const categoriesData = await apiClient('/categories'); // Fetches category data.
      setCategories(categoriesData); // Sets the category data into state.
    } catch (error) {
      console.error("Erro ao buscar categorias:", error); // Logs any error.
    }
  }, []); // <--- EMPTY DEPENDENCY ARRAY makes this function stable.

  // This useEffect is now safe. Since the functions in the dependency array
  // are stable (created only once), this effect will also run only once.
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]); // Depends on the stable fetch functions.

  // CRUD operations
  const addProduct = async (productData) => { // Function to add a new product.
    await apiClient('/products', { method: 'POST', body: productData }); // Calls the API to create a product.
    await fetchProducts(); // Refetches the product list to include the new one.
  };

  const updateProduct = async (id, productData) => { // Function to update an existing product.
    await apiClient(`/products/${id}`, { method: 'PUT', body: productData }); // Calls the API to update a product.
    await fetchProducts(); // Refetches the product list to show the changes.
  };
  
  const removeProduct = async (id) => { // Function to remove a product.
    await apiClient(`/products/${id}`, { method: 'DELETE' }); // Calls the API to delete a product.
    await fetchProducts(); // Refetches the product list to remove the deleted one.
  };

  const value = { // The value object provided by the context.
    products,
    categories,
    status,
    addProduct,
    updateProduct,
    removeProduct,
  };

  return ( // Renders the provider with the value.
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProduct() { // Defines the custom useProduct hook.
  const context = useContext(ProductContext); // Gets the context value.
  if (context === null) { // If used outside a provider...
    throw new Error('useProduct deve ser usado dentro de um ProductProvider'); // Throw an error.
  }
  return context; // Returns the context value.
}