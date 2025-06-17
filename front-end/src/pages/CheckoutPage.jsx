import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../components/ui/Loading";
import CartItems from "../components/product/CartItems";
import AddressSelection from "../components/address/AddressSelection";
import CardSelection from "../components/creditcard/CardSelection";
import { useUser } from "../contexts/UserContext";
import { useAuth } from "../contexts/AuthContext";

const CheckoutPage = () => {
  const navigate = useNavigate();
  // Pega o usuário logado do AuthContext
  const { user } = useAuth();
  // Pega os itens do carrinho e as funções de API do UserContext
  const { cartItems, addOrder, clearCart, getMyAddresses, getMyCards } = useUser();

  // Estado para os dados buscados da API
  const [addresses, setAddresses] = useState([]);
  const [cards, setCards] = useState([]);

  // Estado para controlar as seleções do usuário
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  
  // Estado para controlar a UI
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Efeito para buscar os dados iniciais (endereços e cartões)
  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        const [addressesData, cardsData] = await Promise.all([
          getMyAddresses(),
          getMyCards(),
        ]);

        setAddresses(addressesData);
        setCards(cardsData);

        // Pré-seleciona o primeiro endereço e cartão, se existirem
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
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [getMyAddresses, getMyCards]);
  
  // Calcula o preço total usando useMemo para otimização
  const totalPrice = useMemo(() => 
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems]
  );

  // Handler para quando um novo endereço é adicionado no componente filho
  const handleAddressAdded = (newAddress) => {
    setAddresses(prev => [...prev, newAddress]);
    setSelectedAddressId(newAddress._id); // Seleciona o novo endereço automaticamente
  };

  // Handler para quando um novo cartão é adicionado no componente filho
  const handleCardAdded = (newCard) => {
    setCards(prev => [...prev, newCard]);
    setSelectedCardId(newCard.gatewayPaymentMethodId); // Seleciona o novo cartão
  };

  const handleConfirmOrder = async () => {
    if (!selectedAddressId || !selectedCardId) {
      setError("Por favor, selecione um endereço e uma forma de pagamento.");
      return;
    }
    setError('');
    setIsSubmitting(true);
    
    // Mapeamos os itens do carrinho para o formato que o back-end espera
    const orderData = {
      orderItems: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        product: item._id, // A CORREÇÃO CRUCIAL: Adiciona a propriedade 'product' com o _id
      })),
      shippingAddressId: selectedAddressId,
      paymentMethodId: selectedCardId,
      itemsPrice: totalPrice,
      shippingPrice: 0, 
      totalPrice: totalPrice,
    };
console.log("DADOS QUE SERÃO ENVIADOS PARA A API:", JSON.stringify(orderData, null, 2));
    try {
      
      await addOrder(orderData);
      clearCart(); // Limpa o carrinho no localStorage e no estado
      navigate("/sucesso"); // Redireciona para uma página de sucesso
    } catch (apiError) {
      setError(apiError.message || "Não foi possível completar o pedido.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading size="lg" />;

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link to="/carrinho" className="flex items-center text-blue-600 hover:text-blue-800 mb-5 font-medium">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Carrinho
        </Link>
        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="mr-2 h-5 w-5" /> Informações Pessoais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong className="block text-gray-500">Nome:</strong><p>{user?.name}</p></div>
                <div><strong className="block text-gray-500">E-mail:</strong><p>{user?.email}</p></div>
              </div>
            </div>
            
            <AddressSelection 
              addresses={addresses} 
              selectedAddressId={selectedAddressId}
              onSelectAddress={setSelectedAddressId}
              onAddressAdded={handleAddressAdded}
            />
            <CardSelection 
              cards={cards} 
              selectedCardId={selectedCardId}
              onSelectCard={setSelectedCardId}
              onCardAdded={handleCardAdded}
            />

          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
              <CartItems cartItems={cartItems} />
              <div className="space-y-2 pt-4 mt-4 border-t">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{totalPrice.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })}</span>
                </div>
              </div>
              {error && <p className="text-red-600 text-center my-4 text-sm">{error}</p>}
              <button 
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

export default CheckoutPage;