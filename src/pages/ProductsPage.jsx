// ProductsPage.jsx
import Navbar from "../components/Navbar";
import { useState, useMemo } from "react";
import ProductCard from "../components/product/ProductCard";
import Filter from "../components/filter/Filter";

import { useProduct } from "../contexts/ProductContext";
function ProductGrid({ filtrados }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {filtrados.map((product) => {
        return <ProductCard key={product.id} id={product.id}/>
      })}
    </div>
  );
}

export default function ProductsPage() {
  const {getProducts} = useProduct()

  const [category, setCategory] = useState(""); 
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [search, setSearch] = useState("");
  const products = getProducts(true);

  // somente recalcula quando `category` mudar
  const filtrados = useMemo(() =>{
    return products.filter((product) => {
      return(((product.category === category || category === "") && (product.price >= priceRange[0] && product.price<=priceRange[1])) && (product.name.toLowerCase().includes(search.toLowerCase())))
    })
    },[category, priceRange, search]);

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
    </>
  );
}
