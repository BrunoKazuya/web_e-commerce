import Navbar from "../components/Navbar";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ProductCart from "../components/product/ProductCart";
import Footer from "../components/Footer";
import { useUser } from "../contexts/UserContext";
import { useEffect, useState } from "react";

const CartPage = () => {
  // 1. Pegamos os dados e as funções do contexto global
  const { cartItems, updateCart, deleteCart } = useUser();
  const navigate = useNavigate();

  // 2. Criamos um estado LOCAL para exibir o carrinho.
  // Ele começa com os dados do contexto.
  const [displayCartItems, setDisplayCartItems] = useState(cartItems);

  // 3. Este useEffect SINCRONIZA o estado local com o global.
  // Se o carrinho for alterado em outra página, esta página refletirá a mudança.
  useEffect(() => {
    setDisplayCartItems(cartItems);
  }, [cartItems]);

  // O subtotal agora é calculado a partir do estado local para ser instantâneo
  const subTotal = displayCartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = subTotal;
  
  // 4. A função de mudar a quantidade agora faz a atualização otimista
  const handleQuantityChange = (productId, newQuantity) => {
    // Atualiza o estado LOCAL primeiro para a UI ser instantânea
    setDisplayCartItems((currentItems) =>
      currentItems.map((item) =>
        item._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
    // Em seguida, chama a função do contexto para salvar a mudança permanentemente
    updateCart(productId, newQuantity);
  };

  // 5. A função de remover também faz a atualização otimista
  const handleRemove = (productId) => {
    // Atualiza o estado LOCAL primeiro
    setDisplayCartItems((currentItems) =>
      currentItems.filter((item) => item._id !== productId)
    );
    // Em seguida, chama a função do contexto
    deleteCart(productId);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2 py-12 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Seu Carrinho</h1>

        {displayCartItems.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            {/* ... Mensagem de carrinho vazio ... */}
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Seu carrinho está vazio</h2>
            <Link to="/produtos" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800">Começar a Comprar</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {displayCartItems.map((product) => (
                    <ProductCart
                      key={product._id}
                      product={product}
                      // Passa as novas funções 'handler' para o componente filho
                      onQuantityChange={handleQuantityChange}
                      onRemoveProduct={handleRemove}
                    />
                  ))}
                </ul>
              </div>
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{subTotal.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{total.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                  </div>
                </div>
                <button
                  className="w-full mb-4 bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center justify-center hover:bg-blue-700"
                  onClick={() => navigate('/checkout')}
                >
                  Finalizar Compra
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                <Link to="/produtos" className="text-blue-600 hover:underline flex items-center justify-center text-sm">
                  Continuar Comprando
                </Link>
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