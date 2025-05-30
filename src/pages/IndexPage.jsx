import Navbar from "../components/Navbar.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "../components/product/ProductCard.jsx";
import "swiper/css";
import "swiper/css/navigation";
import BannerIndex from "../components/index/BannerIndex.jsx";
import CategorySection from "../components/category/CategorySection.jsx";
import Footer from "../components/Footer.jsx";
import { useProduct } from "../contexts/ProductContext.jsx";
import { useEffect, useState } from "react";
import Loading from "../components/ui/Loading.jsx";
const IndexPage = () => {
  const { getProducts, getCategories } = useProduct();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function load() {
      try {
        const fetchedProducts = await getProducts(true);
        const fetchedCategories = await getCategories();
        setProducts(fetchedProducts);
        setCategories(fetchedCategories);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <Loading size={"lg"} />;
  }

  return (
    <>
      <Navbar />
      <BannerIndex />
      <section className="bg-gray-50 py-7">
        <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2">
          <h2 className="text-2xl font-bold mb-4">Produtos em destaque</h2>
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
            {products.map((p) => 
              (<SwiperSlide key={p.id}>
                <ProductCard id={p.id} />
              </SwiperSlide>)
            )}
          </Swiper>
        </div>
      </section>
      <CategorySection categories={categories}/>
      <section className="py-16 bg-gray-50 mt-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-8 text-white flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Promoção de Verão</h3>
                <p className="text-white/90 mb-6">
                  Até 40% de desconto em produtos selecionados
                </p>
              </div>
              <a href="/produtos" className="w-full sm:w-auto bg-white text-black py-3 rounded-lg hover:bg-gray-100 cursor-pointer text-center">
                Ver Ofertas
              </a>
            </div>
            <div className="bg-gradient-to-r from-amber-500 to-pink-500 rounded-lg p-8 text-white flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Novidades</h3>
                <p className="text-white/90 mb-6">
                  Confira nossos produtos mais recentes
                </p>
              </div>
              <a href="/produtos" className="w-full sm:w-auto bg-white text-black py-3 rounded-lg hover:bg-gray-100 cursor-pointer text-center">
                Explorar
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Assine Nossa Newsletter</h2>
            <p className="text-gray-600 mb-6">
              Fique por dentro das novidades e ofertas exclusivas
            </p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Digite seu e-mail"
                className="w-full md:w-md rounded-lg px-3 border border-gray-200 focus:outline-none focus:border-blue-300"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-800"
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
