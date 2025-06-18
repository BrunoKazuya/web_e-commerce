import Navbar from "../components/Navbar.jsx"; // Imports the Navbar component.
import { Swiper, SwiperSlide } from "swiper/react"; // Imports Swiper components for carousels.
import ProductCard from "../components/product/ProductCard.jsx"; // Imports the component for displaying a single product.
import "swiper/css"; // Imports the default Swiper styles.
import BannerIndex from "../components/index/BannerIndex.jsx"; // Imports the main banner component for the index page.
import CategorySection from "../components/category/CategorySection.jsx"; // Imports the category section component.
import Footer from "../components/Footer.jsx"; // Imports the Footer component.
import { useProduct } from "../contexts/ProductContext.jsx"; // Imports the custom hook to access product data.
import { useMemo } from "react"; // Imports the useMemo hook for optimization.
import Loading from "../components/ui/Loading.jsx"; // Imports the loading spinner component.
import { Link } from "react-router-dom"; // Imports the Link component for navigation.

const IndexPage = () => { // Defines the IndexPage component.
  // 1. Consumes data and status directly from the ProductContext.
  const { products, categories, status } = useProduct();

  // 2. Uses useMemo to calculate the list of featured products in an optimized way.
  // The filter will only be re-executed if the 'products' list changes.
  const featuredProducts = useMemo(() => {
    if (!products) return [];
    // Example logic for featured products: products with high rating and in stock.
    return products.filter(p => p.inStock > 0).slice(0, 8); // Gets the first 8 in-stock products.
  }, [products]);

  // 3. Handles loading and error states that come from the context.
  if (status === 'loading') { // If data is currently loading...
    return <Loading size="lg" />; // Show a full-page loading indicator.
  }

  if (status === 'error') { // If there was an error fetching data...
    return ( // Display an error message.
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Ocorreu um Erro</h2>
        <p className="text-gray-600">Não foi possível carregar os dados da página inicial.<br/>Por favor, verifique se o servidor back-end está rodando e tente novamente.</p>
      </div>
    );
  }

  return ( // Returns the JSX for the page.
    <>
      <Navbar />
      <BannerIndex />

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && ( // Only render this section if there are featured products.
        <section className="bg-gray-50 py-12"> {/* Section container. */}
          <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2"> {/* Centered content container. */}
            <h2 className="text-2xl font-bold mb-6">Produtos em destaque</h2> {/* Section title. */}
            <Swiper // Swiper component for the product carousel.
              spaceBetween={20} // Space between slides.
              slidesPerView={1} // Default slides per view.
              loop={true} // Enables continuous loop mode.
              breakpoints={{ // Responsive breakpoints for different screen sizes.
                640: { slidesPerView: 2 },
                800: { slidesPerView: 3 },
                1080: { slidesPerView: 4 },
              }}
            >
              {featuredProducts.map((p) => ( // Maps over the featured products.
                <SwiperSlide key={p._id}> {/* Each product is a slide. */}
                  {/* Passes the COMPLETE product object to ProductCard. */}
                  <ProductCard key={p._id} product={p} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <CategorySection categories={categories} />
      
      {/* Static page sections */}
      <section className="py-16 bg-white mt-8"> {/* Promotional section. */}
        <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-8 text-white flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Promoção de Inverno</h3>
                <p className="text-white/90 mb-6">Até 40% de desconto em produtos selecionados</p>
              </div>
              <Link to="/produtos" className="w-full sm:w-auto bg-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 cursor-pointer text-center transition-colors">
                Ver Ofertas
              </Link>
            </div>
            <div className="bg-gradient-to-r from-amber-500 to-pink-500 rounded-lg p-8 text-white flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Novidades</h3>
                <p className="text-white/90 mb-6">Confira nossos produtos mais recentes</p>
              </div>
              <Link to="/produtos" className="w-full sm:w-auto bg-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 cursor-pointer text-center transition-colors">
                Explorar
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50"> {/* Newsletter section. */}
        <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Assine Nossa Newsletter</h2>
            <p className="text-gray-600 mb-6">Fique por dentro das novidades e ofertas exclusivas</p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Digite seu e-mail"
                className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-6 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
              >
                Assinar
              </button>
            </form>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default IndexPage; // Exports the component.