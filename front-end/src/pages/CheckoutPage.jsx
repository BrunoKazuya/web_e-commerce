import { Link, useNavigate } from "react-router-dom"; // Imports routing components.
import { ArrowLeft, User } from "lucide-react"; // Imports icons.
import { useEffect, useState, useMemo } from "react"; // Imports React hooks.
import Navbar from "../components/Navbar"; // Imports the Navbar component.
import Footer from "../components/Footer"; // Imports the Footer component.
import Loading from "../components/ui/Loading"; // Imports the loading spinner component.
import CartItems from "../components/product/CartItems"; // Imports the component to display cart items.
import AddressSelection from "../components/address/AddressSelection"; // Imports the address selection component.
import CardSelection from "../components/creditcard/CardSelection"; // Imports the card selection component.
import { useUser } from "../contexts/UserContext"; // Imports the custom user context hook.
import { useAuth } from "../contexts/AuthContext"; // Imports the custom auth context hook.

const CheckoutPage = () => { // Defines the CheckoutPage component.
  const navigate = useNavigate(); // Initializes the navigate function.
  // Gets the logged-in user from AuthContext.
  const { user } = useAuth();
  // Gets cart items and API functions from UserContext.
  const { cartItems, addOrder, clearCart, getMyAddresses, getMyCards } = useUser();

  // State for data fetched from the API.
  const [addresses, setAddresses] = useState([]);
  const [cards, setCards] = useState([]);

  // State to control user selections.
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  
  // State to control the UI.
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Effect to fetch initial data (addresses and cards).
  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        const [addressesData, cardsData] = await Promise.all([ // Fetches addresses and cards in parallel.
          getMyAddresses(),
          getMyCards(),
        ]);

        setAddresses(addressesData);
        setCards(cardsData);

        // Pre-selects the first address and card, if they exist.
        if (addressesData.length > 0) {
          setSelectedAddressId(addressesData[0]._id);
        }
        if (cardsData.length > 0) {
          setSelectedCardId(cardsData[0].gatewayPaymentMethodId);
        }
      } catch (err) {
        console.error("Erro ao carregar dados de checkout", err);
        setError("Não foi possível carregar seus dados. Tente novamente.");
      } finally {
        setLoading(false); // Sets loading to false after operations complete.
      }
    };

    loadCheckoutData();
  }, [getMyAddresses, getMyCards]); // Dependency array.
  
  // Calculates the total price using useMemo for optimization.
  const totalPrice = useMemo(() => 
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems]
  );

  // Handler for when a new address is added in the child component.
  const handleAddressAdded = (newAddress) => {
    setAddresses(prev => [...prev, newAddress]);
    setSelectedAddressId(newAddress._id); // Selects the new address automatically.
  };

  // Handler for when a new card is added in the child component.
  const handleCardAdded = (newCard) => {
    setCards(prev => [...prev, newCard]);
    setSelectedCardId(newCard.gatewayPaymentMethodId); // Selects the new card.
  };

  const handleConfirmOrder = async () => { // Function to handle order submission.
    if (!selectedAddressId || !selectedCardId) { // Validates that an address and card are selected.
      setError("Por favor, selecione um endereço e uma forma de pagamento.");
      return;
    }
    setError(''); // Clears any previous error.
    setIsSubmitting(true); // Sets submitting state to true.
    
    // We map the cart items to the format the backend expects.
    const orderData = {
      orderItems: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        product: item._id, // Adds the 'product' property with the _id.
      })),
      shippingAddressId: selectedAddressId,
      paymentMethodId: selectedCardId,
      itemsPrice: totalPrice,
      shippingPrice: 0, 
      totalPrice: totalPrice,
    };
    console.log("DADOS QUE SERÃO ENVIADOS PARA A API:", JSON.stringify(orderData, null, 2)); // Debug log.
    try {
      await addOrder(orderData); // Calls the API to create the order.
      clearCart(); // Clears the cart from localStorage and state.
      navigate("/sucesso"); // Redirects to a success page.
    } catch (apiError) {
      setError(apiError.message || "Não foi possível completar o pedido.");
    } finally {
      setIsSubmitting(false); // Sets submitting state back to false.
    }
  };

  if (loading) return <Loading size="lg" />; // Shows a loading spinner while data is being fetched.

  return ( // Returns the JSX for the page.
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12"> {/* Main content container. */}
        <Link to="/carrinho" className="flex items-center text-blue-600 hover:text-blue-800 mb-5 font-medium"> {/* "Back to Cart" link. */}
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Carrinho
        </Link>
        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1> {/* Page title. */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> {/* Main grid for checkout sections. */}
          <div className="lg:col-span-2 space-y-8"> {/* Left column for user info, address, and card selection. */}
            <div className="bg-white rounded-lg shadow-md p-6"> {/* Personal info section. */}
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="mr-2 h-5 w-5" /> Informações Pessoais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"> {/* Grid for name and email. */}
                <div><strong className="block text-gray-500">Nome:</strong><p>{user?.name}</p></div>
                <div><strong className="block text-gray-500">E-mail:</strong><p>{user?.email}</p></div>
              </div>
            </div>
            
            <AddressSelection // Renders the address selection component.
              addresses={addresses} 
              selectedAddressId={selectedAddressId}
              onSelectAddress={setSelectedAddressId}
              onAddressAdded={handleAddressAdded}
            />
            <CardSelection // Renders the card selection component.
              cards={cards} 
              selectedCardId={selectedCardId}
              onSelectCard={setSelectedCardId}
              onCardAdded={handleCardAdded}
            />

          </div>
          <div className="lg:col-span-1"> {/* Right column for order summary. */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24"> {/* Sticky summary card. */}
              <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
              <CartItems cartItems={cartItems} /> {/* Displays the list of items in the cart. */}
              <div className="space-y-2 pt-4 mt-4 border-t"> {/* Total price section. */}
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{totalPrice.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })}</span>
                </div>
              </div>
              {error && <p className="text-red-600 text-center my-4 text-sm">{error}</p>} {/* Displays any submission error. */}
              <button // The confirm order button.
                onClick={handleConfirmOrder} 
                disabled={isSubmitting || cartItems.length === 0} 
                className="flex justify-center items-center py-3 w-full mt-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processando...' : 'Confirmar Pedido'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage; // Exports the component.