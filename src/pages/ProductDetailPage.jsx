import Navbar from "../components/Navbar";
import { ShoppingCart } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "../components/product/ProductCard.jsx";
import "swiper/css";
import "swiper/css/navigation";
import { useEffect, useState } from "react";
import { useProduct } from "../contexts/ProductContext.jsx";
import { useUser } from "../contexts/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import Loading from "../components/ui/Loading.jsx";

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { addCart } = useUser();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true)
  const { getProductById, getRelatedProducts } = useProduct();
  const { id } = useParams();


  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const fetched = await getProductById(id);
        setProduct(fetched);
        const related = await getRelatedProducts(fetched.category, id);
        setRelatedProducts(related);
      } catch (err) {
        console.error("Erro ao buscar produto ou relacionados", err);
      } finally{
        setLoading(false)
      }
    }

    load();
  }, [id, getProductById, getRelatedProducts]);
const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (product && product.inStock === 0) {
      setQuantity(0);
    } else if (product && product.inStock > 0) {
      setQuantity(1);
    }
  }, [product?.inStock]);

 

  

  const minusQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };
  const plusQuantity = () => {
    if (quantity < product.inStock) {
      setQuantity(quantity + 1);
    }
  };

  const cart = () => {
    if (product.inStock > 0) {
      addCart(product, quantity);
      navigate("/carrinho");
    }
  };

   if(!product){
    return <div>O produto nao existe</div>
  }

  if(loading){
    return <Loading size="lg"/>
  }

  return (
    <>
      <Navbar />
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Product Images */}
            <div className="rounded-lg shadow-md">
              <img
                src={`${product.image ?? ""}?w=600&h=600&fit=crop&q=80`}
                alt={product.name ?? ""}
                className="w-full h-auto rounded-md"
              />
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center text-yellow-400 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${
                      i < Math.floor((product.rating ?? 0).toFixed(1))
                        ? "fill-current"
                        : "stroke-current fill-none"
                    }`}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                ))}
                <span className="ml-2 text-gray-600">
                  ({(product.rating ?? 0).toFixed(1)})
                </span>
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-4">
                R$ {(product.price ?? 0).toFixed(2)}
              </p>
              <p className="text-gray-700 mb-6">{product.description ?? ""}</p>

              <div className="flex items-center mb-6">
                <div className="mr-4 flex items-center">
                  <span className="font-medium mr-2">Estoque:</span>
                  {product.inStock ?? 0} disponiveis
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Categoria:</span>
                  <Link
                    to={`/produtos?category=${product.category ?? ""}`}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    {(product.category ?? "").charAt(0).toUpperCase() +
                      (product.category ?? "").slice(1)}
                  </Link>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    className={`h-10 w-10 rounded-none flex items-center justify-center hover:bg-gray-200 ${
                      quantity === 0
                        ? "bg-gray-200 cursor-not-allowed text-gray-400"
                        : "cursor-pointer"
                    }`}
                    aria-label="Diminuir quantidade"
                    onClick={() => minusQuantity()}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="px-6">{quantity}</span>
                  <button
                    className={`h-10 w-10 rounded-r-lg flex items-center justify-center hover:bg-gray-200  ${
                      quantity === product.inStock
                        ? "bg-gray-200 cursor-not-allowed text-gray-400"
                        : "cursor-pointer"
                    }`}
                    aria-label="Aumentar quantidade"
                    onClick={() => plusQuantity()}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <button
                  className={`flex-1  text-white px-4 py-2 rounded-lg  flex items-center justify-center ${
                    product.inStock === 0
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-800 cursor-pointer"
                  }`}
                  onClick={() => cart()}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <section className="py-7">
            <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2">
              <h2 className="text-2xl font-bold mb-4">Produtos relacionados</h2>
              <Swiper
                spaceBetween={20}
                slidesPerView={1}
                loop={true}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                  },
                  800: {
                    slidesPerView: 3,
                  },
                  1080: {
                    slidesPerView: 4,
                  },
                }}
              >
                {(relatedProducts ?? []).map((p) => {
                  return (
                    <SwiperSlide key={p.id}>
                      <ProductCard id={p.id} />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </section>
        </div>
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default ProductDetailPage;
