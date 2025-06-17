import Navbar from "../components/Navbar";
import Footer from "../components/Footer.jsx";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "../components/product/ProductCard.jsx";
import "swiper/css";
import { useEffect, useState, useMemo } from "react";
import { useProduct } from "../contexts/ProductContext.jsx";
import { useUser } from "../contexts/UserContext.jsx";
import Loading from "../components/ui/Loading.jsx";
import apiClient from "../utils/apiClient.jsx";

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Pega a lista completa de produtos do contexto para encontrar os "relacionados"
  const { products: allProducts } = useProduct();
  const { addCart } = useUser();

  // Estado local para esta página
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Efeito para buscar os dados do produto específico ao carregar a página ou mudar o ID
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        navigate('/not-found');
        return;
      }
      
      setLoading(true);
      setError('');
      try {
        const fetchedProduct = await apiClient(`/products/${id}`);
        setProduct(fetchedProduct);
        
        // Define a quantidade inicial baseada no estoque
        if (fetchedProduct.inStock > 0) {
          setQuantity(1);
        } else {
          setQuantity(0);
        }

      } catch (err) {
        console.error("Erro ao buscar produto:", err);
        setError("Produto não encontrado.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  // Calcula os produtos relacionados de forma otimizada
  const relatedProducts = useMemo(() => {
    if (!product || !allProducts) return [];

    return allProducts.filter(p => 
      p.category?._id === product.category?._id && // Mesma categoria
      p._id !== product._id &&                     // Não é o próprio produto
      p.inStock > 0                                // Apenas produtos em estoque
    ).slice(0, 8);                                 // Limita a 8 produtos
  }, [product, allProducts]);


  const adjustQuantity = (amount) => {
    const newQuantity = Number(quantity) + amount;
    if (product && newQuantity >= 1 && newQuantity <= product.inStock) {
      setQuantity(newQuantity);
    }
  };

  // Função para adicionar ao carrinho
  const handleAddToCart = () => {
    if (product && product.inStock > 0 && Number(quantity) > 0) {
      addCart(product, Number(quantity));
      navigate("/carrinho");
    }
  };
  
  // Renderização condicional para loading e erro
  if (loading) return <Loading size="lg"/>;
  if (error) return <div className="h-screen flex items-center justify-center text-center text-red-500">{error}</div>;
  if (!product) return <div className="h-screen flex items-center justify-center text-center">Produto não encontrado.</div>;

  // Variáveis para controle da UI
  const isOutOfStock = product.inStock === 0;
  const canDecrease = quantity > 1;
  const canIncrease = quantity < product.inStock;

  return (
    <>
      <Navbar />
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            
            {/* Imagem do Produto */}
            <div className="rounded-lg shadow-md bg-white p-4">
              <img src={`/img/products/${product.image}`} alt={product.name} className="w-full h-auto rounded-md object-contain" style={{maxHeight: '500px'}}/>
            </div>

            {/* Detalhes do Produto */}
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
                {!isOutOfStock && (
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
                
                <button
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

          {/* Produtos Relacionados */}
          {relatedProducts.length > 0 && (
            <section className="py-12 border-t">
              <h2 className="text-2xl font-bold mb-4">Produtos relacionados</h2>
              <Swiper /* ... */ >
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