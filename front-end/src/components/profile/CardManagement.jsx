// src/components/profile/CardManagement.jsx (Versão com Adição de Cartão)

import { useEffect, useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { Trash2, CreditCard, PlusCircle } from 'lucide-react';
import Loading from '../ui/Loading';
import CardForm from '../creditcard/CardForm';

const CardManagement = () => {
  const { getMyCards, removeCard, addCard } = useUser();
  
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estado para controlar a exibição do formulário de adição
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const data = await getMyCards();
        setCards(data);
        // Se não houver cartões, já abre o formulário
        if (data.length === 0) {
          setShowAddForm(true);
        }
      } catch (err) {
        setError('Não foi possível carregar seus cartões.');
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, [getMyCards]);

  const handleRemove = async (cardId) => {
    if (window.confirm('Tem certeza que deseja remover este cartão?')) {
      try {
        await removeCard(cardId);
        setCards(prevCards => prevCards.filter(card => card._id !== cardId));
      } catch (err) {
        alert(`Erro ao remover cartão: ${err.message}`);
      }
    }
  };

  // Função que será passada para o CardForm
  const handleAddCard = async (formData) => {
    setIsSubmitting(true);
    // Lógica do "gateway falso" para o protótipo
    const cardDataForApi = {
      cardholderName: formData.cardholderName,
      expMonth: formData.expMonth,
      expYear: formData.expYear,
      last4: formData.cardNumber.slice(-4),
      brand: formData.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
      gatewayPaymentMethodId: `proto_card_${window.crypto.randomUUID()}`
    };

    try {
      const newCard = await addCard(cardDataForApi);
      setCards(prev => [...prev, newCard]); // Adiciona o novo cartão à lista
      setShowAddForm(false); // Esconde o formulário após o sucesso
    } catch (error) {
      alert(`Erro ao adicionar cartão: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Meus Cartões Salvos</h3>
      {cards.map(card => (
        <div key={card._id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
          <div className="flex items-center">
            <CreditCard className="h-6 w-6 mr-4 text-gray-600" />
            <div>
              <p className="font-semibold">{card.brand} terminado em {card.last4}</p>
              <p className="text-sm text-gray-500">Expira em: {String(card.expMonth).padStart(2, '0')}/{card.expYear}</p>
            </div>
          </div>
          <button onClick={() => handleRemove(card._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      
      {/* Botão para mostrar/esconder o formulário */}
      {showAddForm ? (
        <CardForm
          onFormSubmit={handleAddCard}
          isSubmitting={isSubmitting}
          onCancel={() => setShowAddForm(false)}
        />
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-blue-600 font-semibold p-3 hover:bg-blue-50 rounded-lg border-2 border-dashed"
        >
          <PlusCircle className="h-4 w-4" />
          Adicionar Novo Cartão
        </button>
      )}
    </div>
  );
};

export default CardManagement;