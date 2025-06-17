const CategoryCard = ({category}) => {
  return (
    <a
      href={`/produtos?category=${category.slug}`}
      className="w-full h-[250px] bg-center bg-no-repeat bg-cover flex justify-center items-center relative rounded-3xl py-0 px-2.5 scale-100 hover:scale-105 transition-all"
      style={{
        backgroundImage:
          `url(http://localhost:3000${category.image})`,
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-0 rounded-3xl"></div>
      <div className="relative z-10 text-center">
        <h3 className="text-xl text-white font-bold">{category.name}</h3>
        <p className="text-sm text-white">{category.slogan}</p>
      </div>
    </a>
  );
};

export default CategoryCard;
