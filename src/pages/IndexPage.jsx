import Navbar from "../components/Navbar.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "../components/product/ProductCard.jsx";
import "swiper/css";
import "swiper/css/navigation";
import BannerIndex from "../components/index/BannerIndex.jsx";
import CategorySection from "../components/category/CategorySection.jsx";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
const IndexPage = () => {
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
                slidesPerView: 3
              },
              1080: {
                slidesPerView: 4
              }
            }}
          >
            <SwiperSlide>
              <ProductCard id={1}/>
            </SwiperSlide>
            <SwiperSlide>
              <ProductCard id={2}/>
            </SwiperSlide>
            <SwiperSlide>
              <ProductCard id={3}/>
            </SwiperSlide>
            <SwiperSlide>
              <ProductCard id={4}/>
            </SwiperSlide>
            <SwiperSlide>
              <ProductCard id={5}/>
            </SwiperSlide>
            <SwiperSlide>
              <ProductCard id={6}/>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>
      <CategorySection/>
      <section className="py-16 bg-gray-50 mt-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-8 text-white flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Promoção de Verão</h3>
                <p className="text-white/90 mb-6">Até 40% de desconto em produtos selecionados</p>
              </div>
              <button className="w-full sm:w-auto bg-white text-black py-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                <Link to="/products?sale=summer">Ver Ofertas</Link>
              </button>
            </div>
            <div className="bg-gradient-to-r from-amber-500 to-pink-500 rounded-lg p-8 text-white flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Novidades</h3>
                <p className="text-white/90 mb-6">Confira nossos produtos mais recentes</p>
              </div>
              <button className="w-full sm:w-auto bg-white text-black py-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                <Link to="/products?new=true">Explorar</Link>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Assine Nossa Newsletter</h2>
            <p className="text-gray-600 mb-6">Fique por dentro das novidades e ofertas exclusivas</p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center">
              <input 
                type="email" 
                placeholder="Digite seu e-mail" 
                className="w-md rounded-lg px-3 border border-gray-200 focus:outline-none focus:border-blue-300" 
              />
              <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-800">Assinar</button>
            </form>
          </div>
        </div>
      </section>
      <Footer/>
      <section className="py-16 bg-gray-50 mt-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-8 text-white flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Promoção de Verão</h3>
                <p className="text-white/90 mb-6">Até 40% de desconto em produtos selecionados</p>
              </div>
              <button className="w-full sm:w-auto bg-white text-black py-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                <Link to="/products?sale=summer">Ver Ofertas</Link>
              </button>
            </div>
            <div className="bg-gradient-to-r from-amber-500 to-pink-500 rounded-lg p-8 text-white flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Novidades</h3>
                <p className="text-white/90 mb-6">Confira nossos produtos mais recentes</p>
              </div>
              <button className="w-full sm:w-auto bg-white text-black py-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                <Link to="/products?new=true">Explorar</Link>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Assine Nossa Newsletter</h2>
            <p className="text-gray-600 mb-6">Fique por dentro das novidades e ofertas exclusivas</p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center">
              <input 
                type="email" 
                placeholder="Digite seu e-mail" 
                className="w-md rounded-lg px-3 border border-gray-200 focus:outline-none focus:border-blue-300" 
              />
              <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-800">Assinar</button>
            </form>
          </div>
        </div>
      </section>
      <Footer/>
    </>
  );
};

export default IndexPage;
