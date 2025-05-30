import Navbar from "../components/Navbar";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCart from "../components/product/ProductCart";
import Footer from "../components/Footer";
import { useUser } from "../contexts/UserContext";
import { useEffect, useState } from "react";
import Loading from "../components/ui/Loading";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [subTotal, setSubTotal] = useState(0);
  const total = subTotal;
  const [loading, setLoading] = useState(true)
  const { getCart, deleteCart, addOrder, setCartQuantity } = useUser();
  const [productCart, setProductCart] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        const fetched = await getCart();
        setProductCart(fetched);
      } catch (error) {
        console.log(error);
      } finally{
        setLoading(false)
      }
    }

    load();
  }, [getCart]);

  useEffect(() => {
    const newSubTotal = productCart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setSubTotal(newSubTotal);
  }, [productCart]);

  function handleRemove(id) {
    setProductCart((current) => current.filter((item) => item.id !== id));
    deleteCart(id);
  }

  const order = () => {

    navigate('/checkout');

  }

  if(loading){
    return <Loading size="lg"/>
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2 py-12">
        <h1 className="text-3xl font-bold mb-8">Seu Carrinho</h1>

        {(productCart.length ?? 0) === 0 && (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-600 mb-6">
              Parece que você ainda não adicionou nenhum item ao seu carrinho.
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
              <Link to="/produtos">Começar a Comprar</Link>
            </button>
          </div>
        )}

        {(productCart.length ?? 0) > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <ul role="list" className="-my-6">
                  {productCart.map((product) => {
                    return (
                      <ProductCart
                        product={product}
                        key={product.id}
                        onQuantityChange={(id, newQty) => {
                          setProductCart((current) =>
                            current.map((item) =>
                              item.id === id
                                ? { ...item, quantity: newQty }
                                : item
                            )
                          );
                        }}
                        onRemoveProduct={(id) => handleRemove(id)}
                      />
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>R$ {subTotal.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>R$ {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <button className="w-full mb-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center hover:bg-blue-800 cursor-pointer" onClick={() => order()}>
                  Finalizar Compra
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                <div className="mt-4 text-center">
                  <Link
                    to="/produtos"
                    className="text-blue-600 hover:underline flex items-center justify-center"
                  >
                    Continuar Comprando
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
