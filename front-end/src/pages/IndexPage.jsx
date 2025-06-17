import Navbar from "../components/Navbar.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "../components/product/ProductCard.jsx";
import "swiper/css";
import BannerIndex from "../components/index/BannerIndex.jsx";
import CategorySection from "../components/category/CategorySection.jsx";
import Footer from "../components/Footer.jsx";
import { useProduct } from "../contexts/ProductContext.jsx";
import { useMemo } from "react";
import Loading from "../components/ui/Loading.jsx";
import { Link } from "react-router-dom";

const IndexPage = () => {
  // 1. Consome os dados e o status diretamente do ProductContext.
  const { products, categories, status } = useProduct();

  // 2. Usa useMemo para calcular a lista de produtos em destaque de forma otimizada.
  // O filtro só será re-executado se a lista de 'products' mudar.
  const featuredProducts = useMemo(() => {
    if (!products) return [];
    // Exemplo de lógica para destaques: produtos com rating alto e em estoque.
    return products.filter(p => p.inStock > 0).slice(0, 8);
  }, [products]);

  // 3. Lida com os estados de carregamento e erro que vêm do contexto.
  if (status === 'loading') {
    return <Loading size="lg" />;
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Ocorreu um Erro</h2>
        <p className="text-gray-600">Não foi possível carregar os dados da página inicial.<br/>Por favor, verifique se o servidor back-end está rodando e tente novamente.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <BannerIndex />

      {/* Seção de Produtos em Destaque */}
      {featuredProducts.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2">
            <h2 className="text-2xl font-bold mb-6">Produtos em destaque</h2>
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              loop={true}
              breakpoints={{
                640: { slidesPerView: 2 },
                800: { slidesPerView: 3 },
                1080: { slidesPerView: 4 },
              }}
            >
              {featuredProducts.map((p) => (
                <SwiperSlide key={p._id}>
                  {/* 4. Passa o objeto de produto COMPLETO para o ProductCard */}
                  <ProductCard key={p._id} product={p} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* Seção de Categorias */}
      <CategorySection categories={categories} />
      
      {/* Seções estáticas da página */}
      <section className="py-16 bg-white mt-8">
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

      <section className="py-16 bg-gray-50">
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

export default IndexPage;