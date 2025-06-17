import { Link } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import CartItems from "../components/product/CartItems";
import { Button } from "@radix-ui/themes";
import { useUser } from "../contexts/UserContext";
import Loading from "../components/ui/Loading";
import Endereco from "../components/address/Endereco";
import Card from "../components/creditcard/Card";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useProduct } from "../contexts/ProductContext";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { getUser, getCart, addOrder, setCartQuantity } = useUser();
  const { updateQuantityInStock } = useProduct();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [cardSelected, setCardSelected] = useState(false);
  const [addressSelected, setAddressSelected] = useState(false);
  const [error, setError] = useState(false);
  const errorMessage = "Por favor selecione um endereço de entrega e uma forma de pagamento"
  useEffect(() => {
    async function Load() {
      try {
        const fetchedUSer = await getUser();
        const fetchedCart = await getCart();
        setCartItems(fetchedCart);
        setUser(fetchedUSer);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    Load();
  }, []);
  if (loading) {
    return <Loading size="lg" />;
  }

  const order = () => {
    if (cardSelected && addressSelected) {
      const order = {
        id: uuidv4(),
        date: Date.now(),
        total: totalPrice,
        products: cartItems.map((product) => {
          updateQuantityInStock(product.id, product.quantity);
          return {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            subTotal: product.price * product.quantity,
          };
        }),
      };

      addOrder(order);
      setCartQuantity(0);
      navigate("/success");
    } else {
      setError(true)
    }
  };

  const totalPrice = cartItems.reduce((accumulator, product) => {
    return accumulator + product.price * product.quantity;
  }, 0);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2 py-12">
        <div className="mb-6">
          <Link
            to="/cart"
            className="flex items-center text-blue-600 hover:text-blue-800 mb-5"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Carrinho
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário de Checkout */}
          <div className="lg:col-span-2 space-y-8">
            {/* Informações Pessoais */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="mr-2 h-5 w-5" />
                Informações Pessoais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-bold" htmlFor="fullName">
                    Nome Completo
                  </Label>
                  <p>{user.name}</p>
                </div>
                <div>
                  <Label className="font-bold" htmlFor="email">
                    E-mail
                  </Label>
                  <p>{user.email}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="font-bold" htmlFor="phone">
                    Telefone
                  </Label>
                  <p>{user.phone}</p>
                </div>
              </div>
            </div>
            <Endereco
              address={user.address}
              addressSelected={(addressSelected) => {
                setAddressSelected(addressSelected);
              }}
            />
            <Card
              cardSelected={(cardSelected) => {
                setCardSelected(cardSelected);
              }}
            />
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              {error && (
                <div className="bg-red-200 w-full text-red-500 py-2 rounded-lg text-center">
                  {errorMessage}
                </div>
              )}
              <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
              <CartItems cartItems={cartItems} />
              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>
                    R${" "}
                    {totalPrice.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="border-t border-gray-200  pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>
                      R${" "}
                      {totalPrice.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={order}
                className="flex justify-center items-center py-3 w-full mt-6 bg-blue-600 text-white rounded hover:bg-blue-800 cursor-pointer"
              >
                Confirmar Pedido
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
