import Navbar from "../components/Navbar"; // Imports the Navbar component.
import Footer from "../components/Footer.jsx"; // Imports the Footer component.
import { ShoppingCart, Minus, Plus } from "lucide-react"; // Imports icons.
import { Link, useParams, useNavigate } from "react-router-dom"; // Imports routing hooks.
import { Swiper, SwiperSlide } from "swiper/react"; // Imports Swiper components for carousels.
import ProductCard from "../components/product/ProductCard.jsx"; // Imports the ProductCard component.
import "swiper/css"; // Imports Swiper's default CSS.
import { useEffect, useState, useMemo } from "react"; // Imports React hooks.
import { useProduct } from "../contexts/ProductContext.jsx"; // Imports the product context hook.
import { useUser } from "../contexts/UserContext.jsx"; // Imports the user context hook.
import Loading from "../components/ui/Loading.jsx"; // Imports the loading spinner component.
import apiClient from "../utils/apiClient.jsx"; // Imports the pre-configured API client.

const ProductDetailPage = () => { // Defines the ProductDetailPage component.
  const navigate = useNavigate(); // Initializes the navigate function.
  const { id } = useParams(); // Gets the product ID from the URL parameters.
  
  // Gets the complete list of products from the context to find "related" ones.
  const { products: allProducts } = useProduct();
  const { addCart } = useUser(); // Gets the addCart function from the user context.

  // Local state for this page.
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Effect to fetch the specific product's data on page load or when the ID changes.
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) { // If there is no ID, navigate away.
        navigate('/not-found');
        return;
      }
      
      setLoading(true); // Sets loading state to true.
      setError(''); // Clears previous errors.
      try {
        const fetchedProduct = await apiClient(`/products/${id}`); // Fetches the product by ID.
        setProduct(fetchedProduct); // Sets the fetched product to state.
        
        // Sets the initial quantity based on stock.
        if (fetchedProduct.inStock > 0) {
          setQuantity(1);
        } else {
          setQuantity(0);
        }

      } catch (err) {
        console.error("Erro ao buscar produto:", err);
        setError("Produto não encontrado.");
      } finally {
        setLoading(false); // Sets loading state to false.
      }
    };

    loadProduct();
  }, [id, navigate]); // Dependency array: runs when 'id' or 'navigate' changes.

  // Calculates related products in an optimized way.
  const relatedProducts = useMemo(() => {
    if (!product || !allProducts) return []; // Returns early if data is not available.

    return allProducts.filter(p => 
      p.category?._id === product.category?._id && // Same category.
      p._id !== product._id &&                     // Not the product itself.
      p.inStock > 0                                // Only products in stock.
    ).slice(0, 8);                                 // Limits to 8 products.
  }, [product, allProducts]); // Dependency array.


  const adjustQuantity = (amount) => { // Function to increase or decrease quantity.
    const newQuantity = Number(quantity) + amount;
    if (product && newQuantity >= 1 && newQuantity <= product.inStock) { // Ensures quantity is within valid range.
      setQuantity(newQuantity);
    }
  };

  // Function to add the product to the cart.
  const handleAddToCart = () => {
    if (product && product.inStock > 0 && Number(quantity) > 0) {
      addCart(product, Number(quantity));
      navigate("/carrinho"); // Navigates to the cart page after adding.
    }
  };
  
  // Conditional rendering for loading and error states.
  if (loading) return <Loading size="lg"/>;
  if (error) return <div className="h-screen flex items-center justify-center text-center text-red-500">{error}</div>;
  if (!product) return <div className="h-screen flex items-center justify-center text-center">Produto não encontrado.</div>;

  // UI control variables.
  const isOutOfStock = product.inStock === 0;
  const canDecrease = quantity > 1;
  const canIncrease = quantity < product.inStock;

  return ( // Returns the JSX for the page.
    <>
      <Navbar />
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            
            {/* Product Image */}
            <div className="rounded-lg shadow-md bg-white p-4">
              <img src={`http://localhost:3000${product.image}`} alt={product.name} className="w-full h-auto rounded-md object-contain" style={{maxHeight: '500px'}}/>
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-blue-600 my-4">{product.price.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })}</p>
              <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

              <div className="flex items-center mb-6 text-sm">
                <div className="mr-6 flex items-center">
                  <strong className="font-medium mr-2">Estoque:</strong> {product.inStock} disponíveis
                </div>
                <div className="flex items-center">
                  <strong className="font-medium mr-2">Categoria:</strong>
                  <Link to={`/produtos?category=${product.category?._id}`} className="text-blue-600 hover:underline">
                    {product.category?.name}
                  </Link>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {!isOutOfStock && ( // Renders quantity selector only if the product is in stock.
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => adjustQuantity(-1)}
                      disabled={!canDecrease}
                      className="h-12 w-12 flex items-center justify-center rounded-l-lg transition-colors hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="w-16 text-center font-medium text-lg">{quantity}</span>

                    <button
                      onClick={() => adjustQuantity(1)}
                      disabled={!canIncrease}
                      className="h-12 w-12 flex items-center justify-center rounded-r-lg transition-colors hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                <button // Add to cart button.
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || Number(quantity) === 0}
                  className={`flex-1 text-white px-4 py-2 rounded-lg flex items-center justify-center font-semibold transition-colors ${
                    isOutOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  }`}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {isOutOfStock ? "Sem Estoque" : "Adicionar ao carrinho"}
                </button>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="py-12 border-t border-gray-200">
              <h2 className="text-2xl font-bold mb-4">Produtos relacionados</h2>
              <Swiper // Carousel for related products.
                spaceBetween={20}
                slidesPerView={1}
                loop={true}
                breakpoints={{
                  640: { slidesPerView: 2, },
                  800: { slidesPerView: 3, },
                  1080: { slidesPerView: 4, },
                }} >
                {relatedProducts.map((p) => (
                  <SwiperSlide key={p._id}><ProductCard product={p} /></SwiperSlide>
                ))}
              </Swiper>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetailPage;