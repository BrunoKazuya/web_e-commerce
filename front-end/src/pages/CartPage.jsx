import Navbar from "../components/Navbar"; // Imports the Navbar component.
import { ShoppingCart, ArrowRight } from "lucide-react"; // Imports icons from lucide-react.
import { Link, useNavigate } from "react-router-dom"; // Imports routing components.
import ProductCart from "../components/product/ProductCart"; // Imports the component for a single product in the cart.
import Footer from "../components/Footer"; // Imports the Footer component.
import { useUser } from "../contexts/UserContext"; // Imports the custom hook to access user context.
import { useEffect, useState } from "react"; // Imports React hooks.

const CartPage = () => { // Defines the CartPage component.
  // 1. We get data and functions from the global context.
  const { cartItems, updateCart, deleteCart } = useUser();
  const navigate = useNavigate(); // Initializes the navigate function.

  // 2. We create a LOCAL state to display the cart.
  // It starts with data from the context.
  const [displayCartItems, setDisplayCartItems] = useState(cartItems);

  // 3. This useEffect SYNCHRONIZES the local state with the global one.
  // If the cart is changed on another page, this page will reflect the change.
  useEffect(() => {
    setDisplayCartItems(cartItems);
  }, [cartItems]);

  // The subtotal is now calculated from the local state to be instantaneous.
  const subTotal = displayCartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = subTotal; // In this case, total is the same as subtotal.
  
  // 4. The quantity change function now performs an optimistic update.
  const handleQuantityChange = (productId, newQuantity) => {
    // Updates the LOCAL state first for an instant UI update.
    setDisplayCartItems((currentItems) =>
      currentItems.map((item) =>
        item._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
    // Then, calls the context function to save the change permanently.
    updateCart(productId, newQuantity);
  };

  // 5. The remove function also performs an optimistic update.
  const handleRemove = (productId) => {
    // Updates the LOCAL state first.
    setDisplayCartItems((currentItems) =>
      currentItems.filter((item) => item._id !== productId)
    );
    // Then, calls the context function.
    deleteCart(productId);
  };

  return ( // Returns the JSX for the page.
    <> {/* React Fragment. */}
      <Navbar /> {/* Renders the navigation bar. */}
      <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2 py-12 min-h-screen"> {/* Main content container. */}
        <h1 className="text-3xl font-bold mb-8">Seu Carrinho</h1> {/* Page title. */}

        {displayCartItems.length === 0 ? ( // Conditionally renders content based on whether the cart is empty.
          <div className="bg-white p-12 rounded-lg shadow-md text-center"> {/* Empty cart message container. */}
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" /> {/* Icon. */}
            <h2 className="text-2xl font-semibold mb-2">Seu carrinho está vazio</h2> {/* Heading. */}
            <Link to="/produtos" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800">Começar a Comprar</Link> {/* Link to start shopping. */}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8"> {/* Grid layout for cart items and summary. */}
            <div className="lg:col-span-2"> {/* Container for the list of cart items. */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <ul role="list" className="-my-6 divide-y divide-gray-200"> {/* Unordered list for cart items. */}
                  {displayCartItems.map((product) => ( // Maps over the items to render each one.
                    <ProductCart // Renders the component for a single cart item.
                      key={product._id}
                      product={product}
                      // Passes the new handler functions to the child component.
                      onQuantityChange={handleQuantityChange}
                      onRemoveProduct={handleRemove}
                    />
                  ))}
                </ul>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1"> {/* Container for the order summary. */}
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24"> {/* Sticky positioning to keep it in view on scroll. */}
                <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2> {/* Summary title. */}
                <div className="space-y-3 mb-6"> {/* Container for price details. */}
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{subTotal.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3"> {/* Container for total with a top border. */}
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{total.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                  </div>
                </div>
                <button // Button to proceed to checkout.
                  className="w-full mb-4 bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center justify-center hover:bg-blue-700"
                  onClick={() => navigate('/checkout')}
                >
                  Finalizar Compra
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                <Link to="/produtos" className="text-blue-600 hover:underline flex items-center justify-center text-sm"> {/* Link to continue shopping. */}
                  Continuar Comprando
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer /> {/* Renders the footer. */}
    </>
  );
};

export default CartPage; // Exports the component.