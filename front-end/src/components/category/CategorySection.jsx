import CategoryCard from "./CategoryCard";

const CategorySection = ({categories}) => {
  return (
    <section className="bg-white mt-4">
      <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2">
        <h2 className="text-2xl font-bold mb-4">Categorias</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
           {categories.map(category => (
            <CategoryCard key={category._id} category={category} />
          ))}
         
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
