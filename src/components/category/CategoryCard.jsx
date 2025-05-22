const CategoryCard = () => {
  return (
    <a
      href="/produtos?category=eletronico"
      className="w-full h-[250px] bg-center bg-no-repeat bg-cover flex justify-center items-center relative rounded-3xl py-0 px-2.5 scale-100 hover:scale-105 transition-all"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&h=400&fit=crop&q=80)",
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-0 rounded-3xl"></div>
      <div className="relative z-10 text-center">
        <h3 className="text-xl text-white font-bold">Eletrônicos</h3>
        <p className="text-sm text-white">Os últimos lançamentos em eletrônicos</p>
      </div>
    </a>
  );
};

export default CategoryCard;
