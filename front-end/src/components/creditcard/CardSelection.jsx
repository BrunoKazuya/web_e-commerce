import { CreditCard, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import CardForm from './CardForm'; // The reusable form component.
import { useUser } from '../../contexts/UserContext';

/**
 * A component that allows a user to select a saved card or add a new one.
 * @param {object} props
 * @param {array} props.cards - The array of user's saved cards.
 * @param {string} props.selectedCardId - The ID of the currently selected card.
 * @param {function} props.onSelectCard - Callback to notify the parent of a selection change.
 * @param {function} props.onCardAdded - Callback to notify the parent after a new card is successfully added.
 */
const CardSelection = ({ cards, selectedCardId, onSelectCard, onCardAdded }) => {
  // Local state to toggle the visibility of the "add new card" form.
  const [showAddForm, setShowAddForm] = useState(cards.length === 0);
  // Get the 'addCard' function from the context, which calls the API.
  const { addCard } = useUser();
  // Local state to manage the submission loading state of the form.
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // This handler is passed to CardForm. It receives the safe, validated data.
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    // This is the "fake gateway" logic for our prototype.
    // In a real app, this would be done by a payment gateway SDK.
    const cardDataForApi = {
      cardholderName: formData.cardholderName,
      expMonth: formData.expMonth,
      expYear: formData.expYear,
      // We simulate what a real gateway would return: last 4 digits and brand.
      last4: formData.cardNumber.slice(-4),
      brand: formData.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
      // We generate a unique ID for the payment method.
      gatewayPaymentMethodId: `proto_card_${window.crypto.randomUUID()}`
    };

    try {
      // Call the API to save the new card.
      const newCard = await addCard(cardDataForApi);
      // Notify the parent component (CheckoutPage) about the new card.
      onCardAdded(newCard);
      // Hide the form on success.
      setShowAddForm(false);
    } catch (error) {
      alert(`Erro ao adicionar cartão: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <CreditCard className="mr-2 h-5 w-5" /> Forma de Pagamento
      </h2>
      
      {/* Conditionally render either the list of saved cards or the add card form. */}
      {!showAddForm ? (
        <div className="space-y-4">
          {cards.map((card) => (
            <div key={card._id} onClick={() => onSelectCard(card.gatewayPaymentMethodId)} className={`p-4 border rounded-lg cursor-pointer ${selectedCardId === card.gatewayPaymentMethodId ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200'}`}>
              <div className="flex items-center">
                <input type="radio" name="card" readOnly checked={selectedCardId === card.gatewayPaymentMethodId} className="h-4 w-4" />
                <div className="ml-3">
                  <p className="font-semibold">{card.brand} terminado em {card.last4}</p>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => setShowAddForm(true)} className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-blue-600 font-semibold p-3 hover:bg-blue-50 rounded-lg border-2 border-dashed">
            <PlusCircle className="h-4 w-4" /> Adicionar Novo Cartão
          </button>
        </div>
      ) : (
        <CardForm 
          onFormSubmit={handleFormSubmit} 
          isSubmitting={isSubmitting} 
          onCancel={() => setShowAddForm(false)} 
        />
      )}
    </div>
  );
};

export default CardSelection;