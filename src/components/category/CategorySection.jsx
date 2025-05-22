const CategorySection = () => {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2">
        <h2 className="text-2xl font-bold mb-4">Categorias</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <a
            href="/produtos?category=eletronicos"
            className="w-full h-[250px] bg-center bg-no-repeat bg-cover flex justify-center items-center relative rounded-3xl py-0 px-2.5 scale-100 hover:scale-105 transition-all"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&h=400&fit=crop&q=80)",
            }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-0 rounded-3xl"></div>
            <div className="relative z-10 text-center">
              <h3 className="text-xl text-white font-bold">Eletrônicos</h3>
              <p className="text-sm text-white">
                Os últimos lançamentos em eletrônicos
              </p>
            </div>
          </a>
          <a
            href="/produtos?category=eletronicos"
            className="w-full h-[250px] bg-center bg-no-repeat bg-cover flex justify-center items-center relative rounded-3xl py-0 px-2.5 scale-100 hover:scale-105 transition-all"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop&q=80)",
            }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-0 rounded-3xl"></div>
            <div className="relative z-10 text-center">
              <h3 className="text-xl text-white font-bold">Móveis</h3>
              <p className="text-sm text-white">
                Móveis estilosos para a sua casa
              </p>
            </div>
          </a>
          <a
            href="/produtos?category=eletronicos"
            className="w-full h-[250px] bg-center bg-no-repeat bg-cover flex justify-center items-center relative rounded-3xl py-0 px-2.5 scale-100 hover:scale-105 transition-all"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=400&fit=crop&q=80)",
            }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-0 rounded-3xl"></div>
            <div className="relative z-10 text-center">
              <h3 className="text-xl text-white font-bold">Moda</h3>
              <p className="text-sm text-white">Roupas da moda e acessorios</p>
            </div>
          </a>
          <a
            href="/produtos?category=eletronicos"
            className="w-full h-[250px] bg-center bg-no-repeat bg-cover flex justify-center items-center relative rounded-3xl py-0 px-2.5 scale-100 hover:scale-105 transition-all"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&h=400&fit=crop&q=80)",
            }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-0 rounded-3xl"></div>
            <div className="relative z-10 text-center">
              <h3 className="text-xl text-white font-bold">Casa & Cozinha</h3>
              <p className="text-sm text-white">
                Itens essenciais para sua casa
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
