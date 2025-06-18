// Import the Link component from react-router-dom for SPA-style navigation.
import { Link } from "react-router-dom";
// Import icons from the lucide-react library for the action buttons.
import { Edit, Trash2 } from "lucide-react";

/**
 * A component that renders a single row in the product management table.
 * @param {object} props
 * @param {object} props.product - The full product object to be displayed.
 * @param {function} props.handleRemove - The callback function to be executed when the delete button is clicked.
 */
const ProductItem = ({ product, handleRemove }) => {
  return (
    // The table row element. The 'key' prop for this should be on the <ProductItem> tag in the parent's .map() loop.
    <tr className="hover:bg-gray-50">

      {/* Table cell for Product Name and Image */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            {/* The image source is constructed using the backend's base URL and the image path stored in the database. */}
            <img
              src={`http://localhost:3000${product.image}`} // Make sure the port is correct
              alt={product.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>
          {/* Displays the product name. */}
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{product.name}</div>
          </div>
        </div>
      </td>

      {/* Table cell for Category Name */}
      <td className="px-6 py-4 whitespace-nowrap">
        {/* Safely accesses the category name using optional chaining (?.), in case the category is not populated. */}
        <div className="text-sm text-gray-900">{product.category?.name}</div>
      </td>

      {/* Table cell for Price */}
      <td className="px-6 py-4 whitespace-nowrap">
        {/* Formats the price number into Brazilian currency format (e.g., R$ 99,99). */}
        <div className="text-sm text-gray-900">
          {product.price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
      </td>

      {/* Table cell for Stock Quantity */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{product.inStock}</div>
      </td>
      
      {/* Table cell for Actions (Edit and Delete) */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {/* Link to the product update page, passing the product's unique _id in the URL. */}
        <Link
          to={`/dashboard/produtos/editar/${product._id}`}
          className="hover:bg-blue-100 text-blue-600 p-2 rounded-lg"
          title="Editar Produto"
        >
          <Edit className="h-4 w-4 inline-block" />
        </Link>

        {/* Button to trigger the delete action. */}
        <button
          // The onClick handler calls the handleRemove function passed down from the parent component.
          onClick={() => handleRemove(product._id)}
          className="hover:bg-red-100 text-red-600 p-2 rounded-lg ml-2"
          title="Deletar Produto"
        >
          <Trash2 className="h-4 w-4 inline-block" />
        </button>
      </td>
    </tr>
  );
};

export default ProductItem;