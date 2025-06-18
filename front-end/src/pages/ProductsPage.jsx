import Navbar from "../components/Navbar"; // Imports the Navbar component.
import { useState, useMemo, useEffect } from "react"; // Imports React hooks.
import ProductCard from "../components/product/ProductCard"; // Imports the ProductCard component.
import Filter from "../components/filter/Filter"; // Imports the Filter component.
import { useSearchParams } from "react-router-dom"; // Imports the hook to read URL search parameters.
import { useProduct } from "../contexts/ProductContext"; // Imports the custom product context hook.
import Loading from "../components/ui/Loading"; // Imports the loading spinner component.
import Footer from "../components/Footer"; // Imports the Footer component.

// The ProductGrid is now correct, expecting the complete 'product' object.
function ProductGrid({ products }) { // Defines a simple component to render the grid of products.
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default function ProductsPage() { // Defines the main ProductsPage component.
  // 1. Consumes global data directly from the context.
  const { products, categories, status } = useProduct();
  const [searchParams] = useSearchParams();

  // 2. Maintains only local state for the filter controls.
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [minMaxRange, setMinMaxRange] = useState([0, 0]);
  const [searchFilter, setSearchFilter] = useState(searchParams.get('searchNavbar') || '');

  // 3. This useEffect now serves to initialize the price filter
  // as soon as the products are loaded from the context.
  useEffect(() => {
    // Whenever the URL parameters change, we update the internal search state.
    setSearchFilter(searchParams.get('searchNavbar') || '');
  }, [searchParams]); // The useEffect runs every time 'searchParams' changes.

  useEffect(() => { // Effect to set up price range filter.
    if (products && products.length > 0) {
      const prices = products.map(p => p.price);
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      setPriceRange([minPrice, maxPrice]); // Sets the initial range of the slider.
      setMinMaxRange([minPrice, maxPrice]); // Sets the absolute min/max for the slider.
    }
  }, [products]); // Runs when the products list is populated.

  // 4. The filtering logic has been corrected to compare the category ID.
  const filteredProducts = useMemo(() => {
    // Ensures the price filter has valid values.
    if (priceRange.length !== 2) return [];

    return products.filter((product) => {
      const categoryMatch = categoryFilter === "" || product.category?._id === categoryFilter;
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
      const searchMatch = product.name.toLowerCase().includes(searchFilter.toLowerCase());
      
      return categoryMatch && priceMatch && searchMatch; // Returns true only if all conditions match.
    });
  }, [categoryFilter, priceRange, searchFilter, products]); // Recalculates when any filter or the products list changes.

  // Handles the global loading status.
  if (status === 'loading') {
    return <Loading size="lg" />;
  }
  
  if (status === 'error') {
     return <p className="text-center text-red-500 py-10">Erro ao carregar produtos.</p>
  }

  return ( // Returns the JSX for the page.
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Nossos Produtos</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1"> {/* Column for the filter component. */}
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
          <div className="lg:col-span-3"> {/* Column for the product grid. */}
            {filteredProducts.length === 0 ? ( // Renders a message if no products match the filters.
              <div className="text-center bg-white p-10 rounded-lg shadow-sm">
                <p className="font-semibold">Nenhum produto encontrado</p>
                <p className="text-sm text-gray-600">Tente ajustar os filtros de busca.</p>
              </div>
            ) : ( // Otherwise, renders the grid of filtered products.
              <ProductGrid products={filteredProducts} />
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}