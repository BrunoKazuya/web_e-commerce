import { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import { CreditCard } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";

const Card = () => {
  const { getCard, addCard } = useUser();

  const [payment, setPayment] = useState("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cards, setCards] = useState([]);
  const [addingNew, setAddingNew] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);

  useEffect(() => {
    const storedCards = getCard();
    if (storedCards && storedCards.length > 0) {
      setCards(storedCards);
      setSelectedCardId(storedCards[0].id || 0);
      setAddingNew(false);
    } else {
      setAddingNew(true);
    }
  }, []);

  const saveCard = () => {
    const newCard = {
      id: cards.length > 0 ? Math.max(...cards.map(c => c.id)) + 1 : 1,
      cardNumber,
      cardName,
      expiryDate,
      cvv,
      paymentMethod: payment,
    };
    addCard(newCard);
    alert("Cartão salvo com sucesso!");
    setCards((prev) => [...prev, newCard]);
    setSelectedCardId(newCard.id);
    setAddingNew(false);
  };

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
                className="flex items-center border p-4 rounded cursor-pointer hover:bg-gray-100"
              >
                <input
                  type="radio"
                  name="selectedCard"
                  className="mr-4"
                  checked={selectedCardId === c.id}
                  onChange={() => setSelectedCardId(c.id)}
                />
                <div>
                  <p><strong>Método:</strong> {c.paymentMethod === "credit" ? "Crédito" : c.paymentMethod === "debit" ? "Débito" : "PIX"}</p>
                  <p><strong>Número:</strong> **** **** **** {c.cardNumber.slice(-4)}</p>
                  <p><strong>Nome:</strong> {c.cardName}</p>
                  <p><strong>Validade:</strong> {c.expiryDate}</p>
                </div>
              </label>
            ))}
          </div>
          <button
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => setAddingNew(true)}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="cardNumber">Número do Cartão</Label>
                  <input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="cardName">Nome no Cartão</Label>
                  <input
                    id="cardName"
                    name="cardName"
                    placeholder="Nome conforme no cartão"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Validade</Label>
                  <input
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/AA"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <input
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={saveCard}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              >
                Salvar Cartão
              </button>
            </>
          )}

          {payment === "pix" && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                Após confirmar o pedido, você receberá o código PIX para pagamento.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Card;
