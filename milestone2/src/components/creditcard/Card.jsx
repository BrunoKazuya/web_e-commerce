import { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import { CreditCard } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";

const Card = ({cardSelected}) => {
  const { getCard, addCard, removeCard} = useUser();
  const [success, setSuccess] = useState(false);
  const [payment, setPayment] = useState("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cards, setCards] = useState([]);
  const [addingNew, setAddingNew] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [cardError, setCardError] = useState("");
  const successMessage = "Cartão adicionado";

  useEffect(() => {
    const storedCards = getCard();
    if (storedCards && storedCards.length > 0) {
      cardSelected(true)
      setCards(storedCards);
      setSelectedCardId(storedCards[0].id || 0);
      setAddingNew(false);
    } else {
      setAddingNew(true);
    }
  }, []);

  
    function isValidCardNumber(cardNumber) {
      const digits = cardNumber.replace(/\D/g, "").split("").reverse().map(Number);
      let sum = 0;
  
      for (let i = 0; i < digits.length; i++) {
        let digit = digits[i];
        if (i % 2 !== 0) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
      }
  
      return sum % 10 === 0;
    }

 const handleSubmit = (e) => {
  e.preventDefault();

  // Validação de número de cartão
  if (!isValidCardNumber(cardNumber)) {
    setCardError("Número de cartão inválido");
    return;
  }

  if (!isValidExpiryDate(expiryDate)) {
  setCardError("Data de validade inválida. Escolha uma data futura.");
  return;
  }


  // Validação extra opcional (ex: nome, validade, CVV)
  if (!cardName || !expiryDate || !cvv) {
    setCardError("Preencha todos os campos do cartão");
    return;
  }

  setCardError("");

  const newCard = {
    id: cards.length > 0 ? Math.max(...cards.map((c) => c.id)) + 1 : 1,
    cardNumber,
    cardName,
    expiryDate,
    cvv,
    paymentMethod: payment,
  };

  addCard(newCard);
  setCards((prev) => [...prev, newCard]);
  setSelectedCardId(newCard.id);
  setAddingNew(false);
  setSuccess(true);
  cardSelected(true);

  console.log("Cartão válido e salvo com sucesso!");
};

const handleCardNameChange = (e) => {
  const value = e.target.value;
  // Permitir apenas letras, espaços e alguns símbolos básicos
  const sanitized = value.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, "");
  setCardName(sanitized);
};


  const handleCardChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Permite só números
    setCardNumber(value);
  };

  const today = new Date();
  const currentMonth = today.toISOString().slice(0, 7);  // Formato: "2025-06"


  const handleRemoveCard = (id) => {
    removeCard(id); // Remove do contexto + localStorage
    setCards((prev) => prev.filter((c) => c.id !== id)); // Atualiza o state local

    // Se o cartão removido era o selecionado, limpa a seleção
    if (selectedCardId === id) {
      setSelectedCardId(null);
      cardSelected(false);
    }

    // Se não sobrou mais nenhum, forçar abertura do formulário
    if (cards.length === 1) {
      setAddingNew(true);
    }
  };

  function isValidExpiryDate(expiryDate) {
  if (!expiryDate) return false;

  const today = new Date();
  const [year, month] = expiryDate.split("-").map(Number);

  const cardDate = new Date(year, month - 1); // JS conta mês de 0 a 11
  const currentDate = new Date(today.getFullYear(), today.getMonth());

  return cardDate >= currentDate;
}

  

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <CreditCard className="mr-2 h-5 w-5" />
        Forma de Pagamento
      </h2>

      {cards.length > 0 && !addingNew ? (
        <>
          <div className="space-y-4">
            {cards.map((c) => (
              <label
                key={c.id}
                className="flex items-center border border-gray-200 p-4 rounded cursor-pointer hover:bg-gray-100"
              >
                <input
                  type="radio"
                  name="selectedCard"
                  className="mr-4"
                  checked={selectedCardId === c.id}
                  onChange={() => setSelectedCardId(c.id)}
                />
                <div>
                  <p>
                    <strong>Método:</strong>{" "}
                    {c.paymentMethod === "credit"
                      ? "Crédito"
                      : c.paymentMethod === "debit"
                      ? "Débito"
                      : "PIX"}
                  </p>
                  <p>
                    <strong>Número:</strong> **** **** ****{" "}
                    {c.cardNumber.slice(-4)}
                  </p>
                  <p>
                    <strong>Nome:</strong> {c.cardName}
                  </p>
                  <p>
                    <strong>Validade:</strong> {c.expiryDate}
                  </p>
                </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCard(c.id)}
                      className="ml-auto text-red-500 text-sm hover:underline"
                    >
                      Remover
                    </button>
              </label>
            ))}
          </div>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 cursor-pointer w-full"
            onClick={() => {
              setSuccess(false);
              setAddingNew(true)}}
          >
            Adicionar novo cartão
          </button>
        </>
      ) : (
        <>
          {/* Radios de pagamento */}
          <div className="mb-4">
            <div className="flex space-x-4">
              {["credit", "debit", "pix"].map((method) => (
                <label key={method} className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={payment === method}
                    onChange={(e) => setPayment(e.target.value)}
                    className="mr-2"
                  />
                  {method === "credit"
                    ? "Cartão de Crédito"
                    : method === "debit"
                    ? "Cartão de Débito"
                    : "PIX"}
                </label>
              ))}
            </div>
          </div>

          {(payment === "credit" || payment === "debit") && (
            <>    
            {cardError && (
              <div className="bg-red-200 w-full text-red-500 py-2 rounded-lg text-center mb-2">
                {cardError}
              </div>
            )}

            {success && (
              <div>
                {console.log({successMessage})}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="cardNumber">Número do Cartão</Label>
                  <input
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    inputMode="numeric"
                    maxLength={16}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={handleCardChange}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="cardName">Nome no Cartão</Label>
                  <input
                    id="cardName"
                    name="cardName"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                    placeholder="Nome conforme no cartão"
                    value={cardName}
                    onChange={handleCardNameChange}
                    maxLength={26}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Validade</Label>
                  <input
                    id="expiryDate"
                    name="expiryDate"
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                    placeholder="MM/AA"
                    value={expiryDate}
                    min={currentMonth}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <input
                    id="cvv"
                    name="cvv"
                    type="text"
                    maxLength={4}
                    inputMode="numeric"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                    required
                  />

                </div>
              </div>
              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 cursor-pointer"
              >
                Salvar Cartão
              </button>
            </form>
            </>
          )}

          {payment === "pix" && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                Após confirmar o pedido, você receberá o código PIX para
                pagamento.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Card;
