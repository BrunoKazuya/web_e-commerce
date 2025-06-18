// src/components/product/ProductCart.jsx

import { Minus, Plus, Trash2 } from "lucide-react"; // Imports icons from the lucide-react library.

const ProductCart = ({ product, onQuantityChange, onRemoveProduct }) => { // Defines the ProductCart component with its props.
  const canDecrease = product.quantity > 1; // Determines if the quantity can be decreased (must be greater than 1).
  const canIncrease = product.quantity < product.inStock; // Determines if the quantity can be increased (must be less than the available stock).

  return ( // Returns the JSX for the component.
    <li className="flex py-6"> {/* List item element for a single cart product. */}
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200"> {/* Container for the product image. */}
        <img // The product image.
          src={`http://localhost:3000${product.image}`} // Sets the image source URL.
          alt={product.name} // Sets the alternative text for the image.
          className="h-full w-full object-cover object-center" // Styling for the image.
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col"> {/* Main container for product details and actions. */}
        <div> {/* Container for product name and price. */}
          <div className="flex justify-between text-base font-medium text-gray-900"> {/* Container for name and total price. */}
            <h3>{product.name}</h3> {/* Displays the product name. */}
            <p className="ml-4 whitespace-nowrap"> {/* Container for the total price of this item. */}
              {(product.price * product.quantity).toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })} {/* Calculates and formats the total price (price * quantity). */}
            </p>
          </div>
          <p className="mt-1 text-sm text-gray-500"> {/* Container for the unit price. */}
            Preço Unit.: {product.price.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })} {/* Displays the formatted unit price. */}
          </p>
          <p className="mt-1 text-sm text-gray-500"> {/* Container for the available stock. */}
            Em estoque: {product.inStock} {/* Displays the available stock count. */}
          </p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm mt-4"> {/* Container for quantity controls and remove button. */}
          <div className="flex items-center border border-gray-300 rounded-lg"> {/* Wrapper for the quantity selector. */}
            <button // The "decrease quantity" button.
              onClick={() => onQuantityChange(product._id, product.quantity - 1)} // Calls the handler to decrease quantity on click.
              disabled={!canDecrease} // Disables the button if quantity cannot be decreased.
              className="h-8 w-8 flex items-center justify-center rounded-l-lg transition-colors hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed" // Styling classes.
            >
              <Minus className="h-3 w-3" /> {/* The minus icon. */}
            </button>
            
            <span className="px-4 text-sm font-medium w-10 text-center">{product.quantity}</span> {/* Displays the current quantity. */}
            
            <button // The "increase quantity" button.
              onClick={() => onQuantityChange(product._id, product.quantity + 1)} // Calls the handler to increase quantity on click.
              disabled={!canIncrease} // Disables the button if quantity cannot be increased.
              className="h-8 w-8 flex items-center justify-center rounded-r-lg transition-colors hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed" // Styling classes.
            >
              <Plus className="h-3 w-3" /> {/* The plus icon. */}
            </button>
          </div>

          <div className="flex"> {/* Container for the remove button. */}
            <button // The "remove from cart" button.
              onClick={() => onRemoveProduct(product._id)} // Calls the handler to remove the product on click.
              type="button" // Specifies the button type.
              className="font-medium text-red-600 hover:text-red-500 flex items-center gap-1" // Styling classes.
            >
              <Trash2 className="h-4 w-4" /> Remover {/* The trash icon and "Remove" text. */}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ProductCart; // Exports the component.