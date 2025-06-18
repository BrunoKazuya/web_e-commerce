// Import the CategoryCard component, which will be used to render each individual category.
import CategoryCard from "./CategoryCard";

/**
 * A component that displays a grid of categories.
 * @param {object} props
 * @param {array} props.categories - An array of category objects to be displayed.
 */
const CategorySection = ({ categories }) => {
  return (
    // The main container for the section.
    <section className="bg-white mt-4 py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2">
        <h2 className="text-2xl font-bold mb-6 text-center">Navegue por Categorias</h2>
        {/* A responsive grid to display the category cards. */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {/* Map over the categories array received via props. */}
          {categories.map(category => (
            // For each category, render a CategoryCard component.
            // The 'key' prop is essential for React to efficiently manage the list.
            // The full 'category' object is passed as a prop to the child component.
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;