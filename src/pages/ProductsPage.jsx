import Navbar from "../components/Navbar";
import React from "react"
import { FilterX, Search } from "lucide-react"
import * as Label from "@radix-ui/react-label"
import * as Checkbox from "@radix-ui/react-checkbox"
import * as Slider from "@radix-ui/react-slider"
import ProductCard from "../components/product/ProductCard";

function ProductGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <ProductCard id={1}/>
      <ProductCard id={2}/>
      <ProductCard id={3}/>
      <ProductCard id={4}/>
      <ProductCard id={5}/>
      <ProductCard id={6}/>
    </div>
  )
}


const ProductsPage = () => {

const sortedProducts = React.useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: String(i + 1),
        name: `Produto ${i + 1}`,
        image: "https://via.placeholder.com/300",
        price: 49.9 + i * 10,
        rating: 3 + (i % 3),
        inStock: i % 2 === 0,
        category: ["esporte", "casual", "formal"][i % 3],
      })),
    []
  )
  const categories = [
    { id: "esporte", name: "Esporte" },
    { id: "casual", name: "Casual" },
    { id: "formal", name: "Formal" },
  ]
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState(null)
  const [priceRange, setPriceRange] = React.useState([0, 500])
  const [showFeaturedOnly, setShowFeaturedOnly] = React.useState(false)
  const [inStockOnly, setInStockOnly] = React.useState(false)
  const [sortOption, setSortOption] = React.useState("")

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCategory(null)
    setPriceRange([0, 500])
    setShowFeaturedOnly(false)
    setInStockOnly(false)
    setSortOption("")
  }

  // Aplicar filtros fictícios
  const filtered = sortedProducts.filter((p) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (selectedCategory && p.category !== selectedCategory) return false
    if (showFeaturedOnly && p.rating < 4) return false
    if (inStockOnly && !p.inStock) return false
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false
    return true
  })
  const finalProducts = filtered


  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2 py-8">
      {/* Título e contagem */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <div className="hidden md:block">
          <p className="text-gray-600">{finalProducts.length} produtos encontrados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar de filtros */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Cabeçalho filtros */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Filtros</h2>
              <button
                onClick={resetFilters}
                className="flex items-center text-gray-500 cursor-pointer hover:text-gray-700 px-2 py-1 rounded"
              >
                <FilterX className="h-4 w-4 mr-1" /> Limpar
              </button>
            </div>
            {/* Search */}
            <div className="mb-6">
              <Label.Root htmlFor="search" className="mb-2 block">Buscar</Label.Root>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="search"
                  type="text"
                  placeholder="Buscar produtos"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 px-3 py-2 border border-gray-200 rounded-md"
                />
              </div>
            </div>
            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Categorias</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <Checkbox.Root
                      id={`category-${category.id}`}
                      checked={selectedCategory === category.id}
                      onCheckedChange={() =>
                        setSelectedCategory(
                          selectedCategory === category.id ? null : category.id
                        )
                      }
                      className="h-4 w-4 border border-gray-200 rounded-sm flex items-center justify-center cursor-pointer hover:bg-blue-200"
                    >
                      <Checkbox.Indicator>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <Label.Root htmlFor={`category-${category.id}`} className="ml-2 text-sm cursor-pointer">{category.name}</Label.Root>
                  </div>
                ))}
              </div>
            </div>
            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Preço</h3>
              <Slider.Root
                value={priceRange}
                max={1000}
                step={50}
                onValueChange={setPriceRange}
                className="relative flex items-center select-none touch-none w-full h-5"
              >
                <Slider.Track className="bg-gray-200 relative flex-1 h-1 rounded-full">
                  <Slider.Range className="absolute bg-blue-600 h-full rounded-full" />
                </Slider.Track>
                {priceRange.map((_, idx) => (
                  <Slider.Thumb key={idx} className="block w-5 h-5 bg-white border border-gray-200 rounded-full cursor-pointer hover:bg-blue-800" />
                ))}
              </Slider.Root>
              <div className="flex items-center justify-between mt-4"><span className="text-sm">R${priceRange[0]}</span><span className="text-sm">R${priceRange[1]}</span></div>
            </div>
          </div>
        </div>
        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className="bg-white p-4 mb-6 rounded-lg shadow-sm flex flex-col sm:flex-row justify-end items-center">
            <div className="flex items-center">
              <span className="mr-3 text-sm">Ordenar por:</span>
              <select className="py-2 px-3 border border-gray-200 rounded-md text-sm" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="">Relevância</option>
                <option value="price-asc">Preço: Menor para maior</option>
                <option value="price-desc">Preço: maior para Menor</option>
                <option value="name-asc">Nome: A para Z</option>
                <option value="name-desc">Nome: Z para A</option>
                <option value="rating">Mais avaliados</option>
              </select>
            </div>
          </div>
          {finalProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-sm text-center">
              <h3 className="text-xl font-semibold mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-600 mb-6">Tente refazer os filtros ou a busca</p>
              <button onClick={resetFilters} className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-800">Limpar filtros</button>
            </div>
          ) : (
            <ProductGrid products={finalProducts} />
          )}
        </div>
      </div>
    </div>
      {/* <Footer /> */}
    </>
  );
};

export default ProductsPage;
