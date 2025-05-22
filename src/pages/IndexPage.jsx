import Navbar from "../components/Navbar.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "../components/product/ProductCard.jsx";
import "swiper/css";
import "swiper/css/navigation";
import BannerIndex from "../components/index/BannerIndex.jsx";
import CategorySection from "../components/category/CategorySection.jsx";
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
              <ProductCard />
            </SwiperSlide>
            <SwiperSlide>
              <ProductCard />
            </SwiperSlide>
            <SwiperSlide>
              <ProductCard />
            </SwiperSlide>
            <SwiperSlide>
              <ProductCard />
            </SwiperSlide>
            <SwiperSlide>
              <ProductCard />
            </SwiperSlide>
            <SwiperSlide>
              <ProductCard />
            </SwiperSlide>
          </Swiper>
        </div>
      </section>
      <CategorySection/>
      <Footer/>
    </>
  );
};

export default IndexPage;
