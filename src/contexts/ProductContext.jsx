import { createContext, useContext, useEffect } from "react";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  useEffect(() => {
    const stored = localStorage.getItem("products");

    if (!stored) {
      // 1. Define o usuário inicial como objeto
      const products = [
        {
          id: 1,
          name: "Premium Wireless Headphones",
          price: 299.99,
          description:
            "Experience crystal-clear sound with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and a comfortable over-ear design.",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
          category: "electronics",
          featured: true,
          inStock: 9,
          rating: 4.8,
        },
        {
          id: 2,
          name: "Ergonomic Office Chair",
          price: 249.99,
          description:
            "Stay comfortable during long work days with this ergonomic office chair featuring adjustable lumbar support, breathable mesh back, and customizable armrests.",
          image: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455",
          category: "furniture",
          featured: true,
          inStock: 0,
          rating: 4.7,
        },
        {
          id: 3,
          name: "Smart Fitness Watch",
          price: 199.99,
          description:
            "Track your fitness goals with this advanced smartwatch. Features include heart rate monitoring, GPS tracking, sleep analysis, and water resistance up to 50 meters.",
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
          category: "electronics",
          featured: true,
          inStock: 4,
          rating: 4.5,
        },
        {
          id: 4,
          name: "Minimalist Desk Lamp",
          price: 59.99,
          description:
            "Enhance your workspace with this sleek, minimalist desk lamp. Adjustable brightness, color temperature settings, and energy-efficient LED lighting.",
          image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
          category: "home",
          featured: false,
          inStock: 6,
          rating: 4.3,
        },
        {
          id: 5,
          name: "Professional Camera Lens",
          price: 899.99,
          description:
            "Capture breathtaking photos with this professional-grade camera lens. Features include fast autofocus, vibration reduction, and exceptional low-light performance.",
          image:
            "https://imgs.search.brave.com/0ZE338kf2IhOUL7B_SulSSTPUs5ZtC3reOBGwwEd2MM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vR3E2MVIw/WHFvbXBLRHpRVC1x/bWw2SnM0VlZEVHVt/MFNxVzFDUU5ESUpR/RS9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTk2/YzNsei9kQzVqYjIw/dmQzQXRZMjl1L2RH/VnVkQzkxY0d4dllX/UnovTHpJd01UZ3ZN/REl2V0VFdC9RMkZ0/TFRFdWFuQm4",
          category: "electronics",
          featured: false,
          inStock: 1,
          rating: 4.9,
        },
        {
          id: 6,
          name: "Leather Messenger Bag",
          price: 159.99,
          description:
            "Stylish and functional leather messenger bag with multiple compartments, padded laptop sleeve, and adjustable shoulder strap.",
          image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
          category: "fashion",
          featured: true,
          inStock: 7,
          rating: 4.6,
        },
        {
          id: 7,
          name: "Bluetooth Portable Speaker",
          price: 79.99,
          description:
            "Take your music anywhere with this compact yet powerful Bluetooth speaker. Features 12-hour battery life, waterproof design, and rich, clear sound.",
          image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
          category: "electronics",
          featured: false,
          inStock: 5,
          rating: 4.4,
        },
        {
          id: 8,
          name: "Ceramic Pour-Over Coffee Set",
          price: 42.99,
          description:
            "Brew the perfect cup of coffee with this elegant ceramic pour-over set. Includes dripper, server, and measuring spoon.",
          image: "https://images.unsplash.com/photo-1516303250609-7ebbb764a5e6",
          category: "home",
          featured: false,
          inStock: 8,
          rating: 4.7,
        },
      ];

      // 3. Serializa o array inteiro em JSON
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, []);

  function addProduct(product) {
    const stored = localStorage.getItem("products");

    const products = stored ? JSON.parse(stored) : [];
    product.id = products.length + 1;
    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
  }

  function updateProduct(product) {
    const stored = localStorage.getItem("products");

    const products = stored ? JSON.parse(stored) : [];
    const newProducts = products.map((p) => {
      if (p.id === product.id) return product;
      return p;
    });
    localStorage.setItem("products", JSON.stringify(newProducts));
  }

  function removeProducts(id) {
    const stored = localStorage.getItem("products");

    const products = stored ? JSON.parse(stored) : [];
    const newProducts = products.filter((p) => p.id !== id);
    localStorage.setItem("products", JSON.stringify(newProducts));
  }

  function getProducts(inStock) {
    const stored = localStorage.getItem("products");

    const products = stored ? JSON.parse(stored) : [];
    if (inStock) return products.filter((p) => p.inStock > 0);
    return products;
  }

  function getProductById(id) {
    const stored = localStorage.getItem("products");
    const products = JSON.parse(stored);

    return products.find((p) => p.id === Number(id));
  }

  function getRelatedProducts(category, id) {
    const stored = localStorage.getItem("products");
    const products = JSON.parse(stored);
    return products.filter(
      (p) => p.category === category && p.id !== Number(id)
    );
  }

  return (
    <ProductContext.Provider
      value={{
        addProduct,
        getProductById,
        getProducts,
        getRelatedProducts,
        updateProduct,
        removeProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

// 6. Hook para usar o AuthContext
export function useProduct() {
  return useContext(ProductContext);
}
