import Navbar from "../components/Navbar";
import { useState, useMemo, useEffect } from "react";
import ProductCard from "../components/product/ProductCard";
import Filter from "../components/filter/Filter";
import { useSearchParams } from "react-router-dom";
import { useProduct } from "../contexts/ProductContext";
import Loading from "../components/ui/Loading";
import Footer from "../components/Footer";


function ProductGrid({ filtrados }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {filtrados.map((product) => {
        return <ProductCard key={product.id} id={product.id} />;
      })}
    </div>
  );
}



export default function ProductsPage() {
  const { getProducts, getCategories } = useProduct();
  const [searchParams] = useSearchParams()
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState([]);
  const [minMaxRage, setMinMaxRange] = useState([]);
   const [search, setSearch] = useState(searchParams.get('searchNavbar') || '')
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const fetchedProducts = getProducts(true);
        const fetchedCategories = getCategories();
        const prices = fetchedProducts.map(p => p.price)

        setPriceRange([Math.floor(Math.min(...prices)), Math.floor(Math.max(...prices)) + 1])
        setMinMaxRange([Math.floor(Math.min(...prices)), Math.floor(Math.max(...prices)) + 1])
        setProducts(fetchedProducts);
        setCategories(fetchedCategories)
      } catch (error) {
        console.log(error);
      } finally {
        
        setLoading(false);
      }
    }
    load();
  }, []);

  // somente recalcula quando `category` mudar
  const filtrados = useMemo(() => {
    return products.filter((product) => {
      return (
        (product.category === category || category === "") &&
        product.price >= priceRange[0] &&
        product.price <= priceRange[1] &&
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [category, priceRange, search, products]);

  if (loading) {
    return <Loading size="lg" />;
  }
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Produtos</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Filter
              selectedCategory={category}
              onCategoryChange={setCategory}
              selectedPrice={priceRange}
              onPriceChange={setPriceRange}
              selectedSearch={search}
              onSearchChange={setSearch}
              minMaxRange={minMaxRage}
              categories={categories}
            />
          </div>
          <div className="lg:col-span-3">
            {filtrados.length === 0 ? (
              <p className="text-center">Nenhum produto encontrado</p>
            ) : (
              <ProductGrid filtrados={filtrados} />
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
