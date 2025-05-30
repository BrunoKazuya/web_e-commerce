import { Link } from 'react-router-dom';
import { ArrowLeft,  User } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Label } from '@radix-ui/react-dropdown-menu';
import { useEffect, useState } from 'react';
import CartItems from '../components/product/CartItems';
import { Button } from '@radix-ui/themes';
import { useUser } from '../contexts/UserContext';
import Loading from '../components/ui/Loading';
import Endereco from '../components/address/Endereco';
import AddressForm from '../components/profile/AddressForm';
import Card from '../components/creditcard/Card';
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const CheckoutPage = () => {

  const navigate = useNavigate();
const { getUser, getCart, getCard ,addOrder , setCartQuantity } = useUser();
  const [cartItems,setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user,setUser] = useState({})
  const [card2, setCard2] = useState([]);  
  const [productCart, setProductCart] = useState([]);

  

  useEffect(() => {
    async function Load(){
      try{
        const fetchedUSer = await getUser();
        const fetchedCart = await getCart();
        const fetchedCard = await getCard();
        setCartItems(fetchedCart);
        setCard2(fetchedCard);
        setUser(fetchedUSer);
      }catch(error){console.log(error)}finally{setLoading(false)}
    } 
    Load();
  },[]);
  if(loading){
    return(
      <Loading size='lg'/>
    );
  }
  
  const order = () => {
    const order = {
      id: uuidv4(),
      date: Date.now(),
      total: totalPrice,
      products: cartItems.map(product => {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        subTotal: product.price * product.quantity,
      }
    })
    
    }

    addOrder(order);
    setProductCart([])
    setCartQuantity(0)
    navigate('/success');

  }

  const totalPrice = cartItems.reduce((accumulator, product) => {
    return accumulator + product.price * product.quantity;
  }, 0);

  return (
    <>
      <Navbar />
      <div className="container-custom py-12">
        <div className="mb-6">
          <Link to="/cart" className="flex items-center text-primary hover:underline">
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
                  <Label className='font-bold' htmlFor="fullName">Nome Completo</Label>
                  <p>{user.name}</p>
                </div>
                <div>
                  <Label className='font-bold' htmlFor="email">E-mail</Label>
                  <p>{user.email}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className='font-bold' htmlFor="phone">Telefone</Label>
                  <p>{user.phone}</p>
                </div>
              </div>
            </div>

            {/* Endereço de Entrega */}
              
           <Endereco  
            address={user.address} 

            />

            {/* Forma de Pagamento */}
            <Card/>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
              
              <CartItems cartItems={cartItems}/>

              {/* Produtos */}
              <div className="space-y-4 mb-6">
                {/*{cartItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <img
                      src={`${item.product.image}?w=60&h=60&fit=crop&q=80`}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">
                      R$ {(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}*/}
              </div>

              {/* Totais */}
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>R$ {totalPrice.toFixed(2)}</span>
                </div>

                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>R$ {totalPrice.toFixed(2)}</span>

                  </div>
                </div>
              </div>

              <Button onClick={order} className="flex justify-center items-center py-3 w-full mt-6 bg-blue-500 text-white rounded hover:opacity-80">
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