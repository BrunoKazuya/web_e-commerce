import Navbar from "../components/Navbar";
import { useState, useMemo, useEffect } from "react";
import ProductCard from "../components/product/ProductCard";
import Filter from "../components/filter/Filter";
import { useSearchParams } from "react-router-dom";
import { useProduct } from "../contexts/ProductContext";
import Loading from "../components/ui/Loading";
import Footer from "../components/Footer";

// O ProductGrid agora está correto, esperando o objeto 'product' completo
function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default function ProductsPage() {
  // 1. Consome os dados globais diretamente do contexto
  const { products, categories, status } = useProduct();
  const [searchParams] = useSearchParams();

  // 2. Mantém apenas o estado local para os controles do filtro
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [minMaxRange, setMinMaxRange] = useState([0, 0]);
  const [searchFilter, setSearchFilter] = useState(searchParams.get('searchNavbar') || '');

  // 3. Este useEffect agora serve para inicializar o filtro de preço
  // assim que os produtos forem carregados pelo contexto.
  useEffect(() => {
    if (products && products.length > 0) {
      const prices = products.map(p => p.price);
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      setPriceRange([minPrice, maxPrice]);
      setMinMaxRange([minPrice, maxPrice]);
    }
  }, [products]);

  // 4. A lógica de filtro foi corrigida para comparar o ID da categoria
  const filteredProducts = useMemo(() => {
    // Garante que o filtro de preço tenha valores válidos
    if (priceRange.length !== 2) return [];

    return products.filter((product) => {
      const categoryMatch = categoryFilter === "" || product.category?._id === categoryFilter;
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
      const searchMatch = product.name.toLowerCase().includes(searchFilter.toLowerCase());
      
      return categoryMatch && priceMatch && searchMatch;
    });
  }, [categoryFilter, priceRange, searchFilter, products]);

  // Lida com o status de carregamento global
  if (status === 'loading') {
    return <Loading size="lg" />;
  }
  
  if (status === 'error') {
     return <p className="text-center text-red-500 py-10">Erro ao carregar produtos.</p>
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Nossos Produtos</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Filter
              selectedCategory={categoryFilter}
              onCategoryChange={setCategoryFilter}
              selectedPrice={priceRange}
              onPriceChange={setPriceRange}
              selectedSearch={searchFilter}
              onSearchChange={setSearchFilter}
              minMaxRange={minMaxRange}
              categories={categories}
            />
          </div>
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center bg-white p-10 rounded-lg shadow-sm">
                <p className="font-semibold">Nenhum produto encontrado</p>
                <p className="text-sm text-gray-600">Tente ajustar os filtros de busca.</p>
              </div>
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}