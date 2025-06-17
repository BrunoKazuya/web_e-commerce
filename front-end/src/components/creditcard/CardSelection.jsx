import { CreditCard, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import CardForm from './CardForm'; // Nosso novo formulário
import { useUser } from '../../contexts/UserContext';

const CardSelection = ({ cards, selectedCardId, onSelectCard, onCardAdded }) => {
  const [showAddForm, setShowAddForm] = useState(cards.length === 0);
  const { addCard } = useUser(); // A função do contexto que chama a API
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    // Lógica do gateway falso que estava no controller
    const cardDataForApi = {
      cardholderName: formData.cardholderName,
      expMonth: formData.expMonth,
      expYear: formData.expYear,
      // Estes dados viriam do gateway real, aqui simulamos
      last4: formData.cardNumber.slice(-4),
      brand: formData.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
      gatewayPaymentMethodId: `proto_card_${window.crypto.randomUUID()}`
    };

    try {
      const newCard = await addCard(cardDataForApi);
      onCardAdded(newCard);
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
          <button onClick={() => setShowAddForm(true)} className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-blue-600 font-semibold p-3 hover:bg-blue-50 rounded-lg">
            <PlusCircle className="h-4 w-4" /> Adicionar Novo Cartão
          </button>
        </div>
      ) : (
        <CardForm onFormSubmit={handleFormSubmit} isSubmitting={isSubmitting} onCancel={() => setShowAddForm(false)} />
      )}
    </div>
  );
};

export default CardSelection;