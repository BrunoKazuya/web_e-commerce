import { ShoppingCart } from "lucide-react"; // Imports the shopping cart icon.
import { useUser } from "../../contexts/UserContext"; // Imports the custom hook to access user context (and cart functions).
import { useNavigate, Link } from "react-router-dom"; // Imports Link for client-side navigation.

const ProductCard = ({ product }) => { // The component receives the entire 'product' object as a prop.
  const navigate = useNavigate(); // Initializes the navigate function.
  const { addCart } = useUser(); // Destructures the addCart function from the user context.

  // A "guard clause" to prevent errors if the product is not passed.
  if (!product) { // Checks if the product prop is falsy.
    return null; // If so, renders nothing to avoid errors.
  }

  const isOutOfStock = product.inStock === 0; // Boolean flag to check if the product is out of stock.

  // The cart function now uses the 'product' object and checks the stock.
  const handleAddToCart = () => { // Defines the handler for the "add to cart" button.
    if (isOutOfStock) return; // Does nothing if the product is out of stock.
    
    addCart(product, 1); // Calls the addCart function from the context with the product and quantity 1.
    navigate("/carrinho"); // Navigates the user to the cart page.
  };

  return ( // Returns the JSX for the product card.
    <div className="group relative flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"> {/* Card container with styling. */}
      <Link to={`/produto/${product._id}`} className="flex-grow"> {/* Wraps the main content in a Link to the product's detail page. */}
        <div className="aspect-h-1 aspect-w-1 w-full bg-gray-200"> {/* Container for the image, maintaining aspect ratio. */}
          <img // The product image.
            src={`http://localhost:3000${product.image}`} // Sets the image source URL.
            alt={product.name} // Sets the alternative text.
            className="h-48 w-full object-cover object-center group-hover:opacity-80 transition-opacity" // Styling for the image.
          />
        </div>
        <div className="p-4 space-y-2"> {/* Container for the product information. */}
          <h3 className="text-base font-semibold text-gray-800 truncate" title={product.name}> {/* Product name, truncated if too long. */}
            {product.name}
          </h3>
          <p className="text-lg font-bold text-gray-900"> {/* Product price. */}
            {product.price.toLocaleString("pt-BR", { // Formats the price as Brazilian currency.
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
      </Link>
      
      <div className="border-t border-gray-200 p-4 mt-auto"> {/* Container for the action button at the bottom of the card. */}
        <button // The "Add to cart" button.
          onClick={handleAddToCart} // Sets the click handler.
          disabled={isOutOfStock} // The button is disabled if there is no stock.
          className={`w-full flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors ${ // Dynamically applies classes based on stock status.
            isOutOfStock
              ? 'bg-gray-400 cursor-not-allowed' // Styles for out of stock state.
              : 'bg-blue-600 hover:bg-blue-700' // Styles for in-stock state.
          }`}
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> {/* Shopping cart icon. */}
          {isOutOfStock ? 'Sem Estoque' : 'Adicionar'} {/* Button text changes based on stock status. */}
        </button>
      </div>
    </div>
  );
};

export default ProductCard; // Exports the component.