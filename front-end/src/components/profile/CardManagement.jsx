import { useEffect, useState } from 'react'; // Imports React hooks for side effects and state management.
import { useUser } from '../../contexts/UserContext'; // Imports a custom hook to access user-related functions.
import { Trash2, CreditCard, PlusCircle } from 'lucide-react'; // Imports icons from the lucide-react library.
import Loading from '../ui/Loading'; // Imports the Loading spinner component.
import CardForm from '../creditcard/CardForm'; // Imports the form for adding a new credit card.

const CardManagement = () => { // Defines the CardManagement component.
  const { getMyCards, removeCard, addCard } = useUser(); // Destructures card-related functions from the user context.
  
  const [cards, setCards] = useState([]); // State to store the list of user's cards.
  const [loading, setLoading] = useState(true); // State to manage the loading status.
  const [error, setError] = useState(''); // State to store any error messages.
  
  const [showAddForm, setShowAddForm] = useState(false); // State to toggle the visibility of the CardForm.
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track form submission status.

  useEffect(() => { // Hook to fetch cards when the component mounts.
    const fetchCards = async () => { // Defines an async function to get the cards.
      try { // Starts a try-catch block for the API call.
        const data = await getMyCards(); // Calls the function from the context to get card data.
        setCards(data); // Sets the fetched data into the state.
        if (data.length === 0) { // Checks if the user has any saved cards.
          setShowAddForm(true); // If not, show the add form by default.
        }
      // eslint-disable-next-line no-unused-vars
      } catch (_err) { // If the fetch fails...
        setError('Não foi possível carregar seus cartões.'); // Set an error message.
      } finally { // The finally block always executes.
        setLoading(false); // Set loading to false regardless of outcome.
      }
    };
    fetchCards(); // Calls the fetch function.
  }, [getMyCards]); // Dependency array ensures this runs only once, as getMyCards is stable.

  const handleRemove = async (cardId) => { // Defines an async function to handle card removal.
    if (window.confirm('Tem certeza que deseja remover este cartão?')) { // Asks for user confirmation.
      try { // Starts a try-catch block.
        await removeCard(cardId); // Calls the removeCard function from the context.
        setCards(prevCards => prevCards.filter(card => card._id !== cardId)); // Updates the state by filtering out the removed card.
      } catch (err) { // If removal fails...
        alert(`Erro ao remover cartão: ${err.message}`); // Show an alert with the error message.
      }
    }
  };

  const handleAddCard = async (formData) => { // Defines an async function to handle adding a new card.
    setIsSubmitting(true); // Sets submitting state to true.
    const cardDataForApi = { // Creates a data object for the API, simulating a payment gateway response.
      cardholderName: formData.cardholderName, // Gets cardholder name from form data.
      expMonth: formData.expMonth, // Gets expiration month.
      expYear: formData.expYear, // Gets expiration year.
      last4: formData.cardNumber.slice(-4), // Extracts the last 4 digits of the card number.
      brand: formData.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard', // Determines the card brand based on the first digit.
      gatewayPaymentMethodId: `proto_card_${window.crypto.randomUUID()}` // Creates a unique mock gateway ID.
    };

    try { // Starts a try-catch block for the add operation.
      const newCard = await addCard(cardDataForApi); // Calls the addCard function from the context.
      setCards(prev => [...prev, newCard]); // Adds the newly created card to the local state.
      setShowAddForm(false); // Hides the form after successful submission.
    } catch (error) { // If adding fails...
      alert(`Erro ao adicionar cartão: ${error.message}`); // Show an alert with the error.
    } finally { // The finally block always executes.
      setIsSubmitting(false); // Sets submitting state back to false.
    }
  };

  if (loading) return <Loading />; // If loading, show the loading spinner.
  if (error) return <p className="text-red-500">{error}</p>; // If there's an error, display it.

  return ( // Returns the JSX for the component.
    <div className="space-y-4"> {/* Main container with spacing between children. */}
      <h3 className="text-xl font-semibold">Meus Cartões Salvos</h3> {/* Section title. */}
      {cards.map(card => ( // Maps over the cards array to render each one.
        <div key={card._id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"> {/* Container for a single card. */}
          <div className="flex items-center"> {/* Flex container for card icon and details. */}
            <CreditCard className="h-6 w-6 mr-4 text-gray-600" /> {/* Credit card icon. */}
            <div> {/* Container for card text details. */}
              <p className="font-semibold">{card.brand} terminado em {card.last4}</p> {/* Displays brand and last 4 digits. */}
              <p className="text-sm text-gray-500">Expira em: {String(card.expMonth).padStart(2, '0')}/{card.expYear}</p> {/* Displays expiration date. */}
            </div>
          </div>
          <button onClick={() => handleRemove(card._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"> {/* Remove button. */}
            <Trash2 className="h-4 w-4" /> {/* Trash icon. */}
          </button>
        </div>
      ))}
      
      {showAddForm ? ( // Conditionally renders the form or the "add" button.
        <CardForm // Renders the CardForm.
          onFormSubmit={handleAddCard} // Passes the submit handler.
          isSubmitting={isSubmitting} // Passes the submitting state.
          onCancel={() => setShowAddForm(false)} // Passes a function to hide the form.
        />
      ) : (
        <button // The "Add New Card" button.
          onClick={() => setShowAddForm(true)} // Click handler to show the form.
          className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-blue-600 font-semibold p-3 hover:bg-blue-50 rounded-lg border-2 border-dashed" // Styling for the button.
        >
          <PlusCircle className="h-4 w-4" /> {/* Plus icon. */}
          Adicionar Novo Cartão
        </button>
      )}
    </div>
  );
};

export default CardManagement; // Exports the component.