import { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiClient from "../utils/apiClient";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('idle');

  // A MUDANÇA ESTÁ AQUI: o array de dependências do useCallback está vazio.
  // Isso garante que a função fetchProducts seja criada apenas UMA VEZ.
  const fetchProducts = useCallback(async () => {
    setStatus('loading');
    try {
      const productsData = await apiClient('/products');
      setProducts(productsData);
      setStatus('success');
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setStatus('error');
    }
  }, []); // <--- ARRAY DE DEPENDÊNCIAS VAZIO

  // A mesma mudança é aplicada aqui para fetchCategories.
  const fetchCategories = useCallback(async () => {
    try {
      const categoriesData = await apiClient('/categories');
      setCategories(categoriesData);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  }, []); // <--- ARRAY DE DEPENDÊNCIAS VAZIO

  // Este useEffect agora está seguro. Como as funções no array de dependências
  // são estáveis (criadas apenas uma vez), este efeito também rodará apenas uma vez.
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // --- O resto do seu contexto continua igual ---

  const addProduct = async (productData) => {
    await apiClient('/products', { method: 'POST', body: productData });
    await fetchProducts();
  };

  const updateProduct = async (id, productData) => {
    await apiClient(`/products/${id}`, { method: 'PUT', body: productData });
    await fetchProducts();
  };
  
  const removeProduct = async (id) => {
    await apiClient(`/products/${id}`, { method: 'DELETE' });
    await fetchProducts();
  };

  const value = {
    products,
    categories,
    status,
    addProduct,
    updateProduct,
    removeProduct,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === null) {
    throw new Error('useProduct deve ser usado dentro de um ProductProvider');
  }
  return context;
}