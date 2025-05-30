import { createContext, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
const ProductContext = createContext();

export function ProductProvider({ children }) {
  useEffect(() => {
    const stored = localStorage.getItem("products");

    if (!stored) {
      // 1. Define o usuário inicial como objeto
      const products = [
        {
          id: uuidv4(),
          name: "Fones de Ouvido Bluetooth Premium",
          price: 299.99,
          description:
            "Experimente um som cristalino com nossos fones de ouvido Bluetooth premium. Contam com cancelamento ativo de ruído, bateria de 30 horas e design over-ear confortável.",
          image: "produto1.jpeg",
          category: "eletronicos",
          inStock: 9,
          rating: 4.8,
        },
        {
          id: uuidv4(),
          name: "Cadeira de Escritório Ergonômica",
          price: 249.99,
          description:
            "Mantenha-se confortável durante longos dias de trabalho com esta cadeira de escritório ergonômica, com suporte lombar ajustável, encosto em malha respirável e braços personalizáveis.",
          image: "produto2.jpeg",
          category: "moveis",
          inStock: 0,
          rating: 4.7,
        },
        {
          id: uuidv4(),
          name: "Relógio Fitness Inteligente",
          price: 199.99,
          description:
            "Acompanhe suas metas de fitness com este relógio inteligente avançado. Recursos incluem monitor de frequência cardíaca, GPS, análise de sono e resistência à água de até 50 metros.",
          image: "produto3.jpeg",
          category: "eletronicos",
          inStock: 4,
          rating: 4.5,
        },
        {
          id: uuidv4(),
          name: "Luminária de Mesa Minimalista",
          price: 59.99,
          description:
            "Melhore seu espaço de trabalho com esta luminária de mesa minimalista. Ajuste de brilho, controle de temperatura de cor e iluminação LED de baixo consumo.",
          image: "produto4.jpeg",
          category: "casa-cozinha",
          inStock: 6,
          rating: 4.3,
        },
        {
          id: uuidv4(),
          name: "Lente Profissional para Câmera",
          price: 899.99,
          description:
            "Capture fotos incríveis com esta lente profissional para câmera. Possui autofoco rápido, redução de vibração e desempenho excepcional em baixa luminosidade.",
          image: "produto5.png",
          category: "eletronicos",
          inStock: 1,
          rating: 4.9,
        },
        {
          id: uuidv4(),
          name: "Bolsa Carteiro de Couro",
          price: 159.99,
          description:
            "Bolsa carteiro de couro estilosa e funcional, com múltiplos compartimentos, compartimento acolchoado para laptop e alça ajustável.",
          image: "produto6.jpeg",
          category: "moda",
          inStock: 7,
          rating: 4.6,
        },
        {
          id: uuidv4(),
          name: "Caixa de Som Bluetooth Portátil",
          price: 79.99,
          description:
            "Leve sua música para qualquer lugar com esta caixa de som Bluetooth compacta e potente. Bateria de 12 horas, design à prova d’água e som rico e claro.",
          image: "produto7.jpeg",
          category: "eletronicos",
          inStock: 5,
          rating: 4.4,
        },
        {
          id: uuidv4(),
          name: "Conjunto de Café Pour-Over em Cerâmica",
          price: 42.99,
          description:
            "Prepare a xícara perfeita com este elegante conjunto de pour-over em cerâmica. Inclui coador, jarra e colher medidora.",
          image: "produto8.png",
          category: "casa-cozinha",
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

    return products.find((p) => p.id === id);
  }

  function getRelatedProducts(category, id) {
    const stored = localStorage.getItem("products");
    const products = JSON.parse(stored);
    return products.filter((p) => p.category === category && p.id !== id);
  }

  function updateQuantityInStock(id, quantity) {
    const product = getProductById(id);
    const updatedProduct = { ...product, inStock: product.inStock - quantity };
    const products = getProducts();
    const newProducts = products.map((p) => {
      if (p.id === updatedProduct.id) return updatedProduct;
      return p;
    });
    localStorage.setItem("products", JSON.stringify(newProducts));
  }

  function getCategories() {
    return [
      {
        id: 1,
        name: "Móveis",
        slogan: "Móveis estilosos para a sua casa",
        slug: "moveis",
        image: "moveis.jpeg",
      },
      {
        id: 2,
        name: "Eletrônicos",
        slogan: "Os últimos lançamentos em eletrônicos",
        slug: "eletronicos",
        image: "eletronicos.jpeg",
      },
      {
        id: 3,
        name: "Moda",
        slogan: "Roupas da moda e acessorios",
        slug: "moda",
        image: "moda.jpeg",
      },
      {
        id: 4,
        name: "Casa & Cozinha",
        slogan: "Itens essenciais para sua casa",
        slug: "casa-cozinha",
        image: "casa-cozinha.jpeg",
      },
    ];
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
        getCategories,
        updateQuantityInStock,
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
