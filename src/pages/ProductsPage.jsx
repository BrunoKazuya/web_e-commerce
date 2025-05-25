// ProductsPage.jsx
import Navbar from "../components/Navbar";
import React, { useState, useMemo } from "react";
import ProductCard from "../components/product/ProductCard";
import Filter from "../components/filter/Filter";
import { getProductById } from "../data/products";

function ProductGrid({ filtrados }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {filtrados.map((id) => (
        <ProductCard key={id} id={id} />
      ))}
    </div>
  );
}

export default function ProductsPage() {
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(1000);
  const [search, setSearch] = useState("");
  const array_id = [1, 2, 3, 4, 5, 6];

  // somente recalcula quando `category` mudar
  const filtrados = useMemo(() =>{
    return array_id.filter((id) => {
      let product = getProductById(id);      
      if (!product) return false;

      return(((product.category === category || category === "") && product.price<=price) && (product.name.toLowerCase().includes(search)))
    })
    },[category, price, search, array_id]);

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
              selectedPrice={price}
              onPriceChange={setPrice}
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
