// Import the Link component from react-router-dom for client-side navigation.
import { Link } from "react-router-dom";

/**
 * A presentational component for a single category card.
 * @param {object} props
 * @param {object} props.category - The category object containing data to display.
 */
const CategoryCard = ({ category }) => {
  // Construct the full image URL.
  // The category.image path (e.g., /img/categories/cat.jpg) is combined with the backend URL.
  const imageUrl = `http://localhost:3000${category.image}`;

  return (
    // Use the Link component for SPA navigation instead of a standard <a> tag.
    // This navigates to the products page, pre-filtered by the category's ID.
    <Link to={`/produtos?category=${category._id}`} className="group block">
      <div
        className="w-full h-[250px] bg-center bg-no-repeat bg-cover flex justify-center items-center relative rounded-lg shadow-md hover:shadow-xl transition-all"
        // The background image is set via inline styles.
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        {/* An overlay div to darken the background image, making the text more readable. */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-0 rounded-lg"></div>
        {/* A container for the text content, positioned above the overlay with z-index. */}
        <div className="relative z-10 text-center p-2">
          {/* Displays the category name. */}
          <h3 className="text-xl text-white font-bold">{category.name}</h3>
          {/* Displays the category slogan. */}
          <p className="text-sm text-white">{category.slogan}</p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;