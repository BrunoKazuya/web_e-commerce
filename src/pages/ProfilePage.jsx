import * as Tabs from "@radix-ui/react-tabs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Package, MapPin, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { ShoppingCart} from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import OrderCard from "../components/profile/OrderCard";
import AddressForm from "../components/profile/AddressForm"
import AddressCard from "../components/profile/AddressCard";
import ChangePasswordForm from "../components/profile/ChangePasswordForm";
import ProfileForm from "../components/profile/ProfileForm";
import Loading from "../components/ui/Loading";

const ProfilePage = () => {
  const { getOrder, getUser, getAddress } = useUser();
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [user, setUser] = useState([]);
  const [tabs, setTabs] = useState("pedidos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const userFetched = await getUser();
        setUser(userFetched);
        const fetchedOrder = await getOrder();
        setOrders(fetchedOrder);
        const fetchedAddress = await getAddress();
        setAddresses(fetchedAddress);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <Loading size="lg" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Meu Perfil</h1>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Informações da Conta
              </h2>
              <ProfileForm user={user} />
            </div>

            <Tabs.Root defaultValue="orders" className="mt-6">
              <Tabs.List className="grid grid-cols-3 mb-8 w-full bg-gray-100 rounded-lg p-1">
                <Tabs.Trigger
                  value="orders"
                  className={`flex items-center py-1 px-2 text-center cursor-pointer ${
                    tabs === "pedidos" ? "bg-white text-black" : "text-gray-400"
                  } rounded-lg`}
                  onClick={() => setTabs("pedidos")}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Pedidos
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="addresses"
                  className={`flex items-center py-1 px-2 text-center cursor-pointer ${
                    tabs === "endereço"
                      ? "bg-white text-black"
                      : "text-gray-400"
                  } rounded-lg`}
                  onClick={() => setTabs("endereço")}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Endereços
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="security"
                  className={`flex items-center py-1 px-2 text-center cursor-pointer ${
                    tabs === "segurança"
                      ? "bg-white text-black"
                      : "text-gray-400"
                  } rounded-lg`}
                  onClick={() => setTabs("segurança")}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Segurança
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="orders">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">
                    Histórico de Pedidos
                  </h3>
                  {orders.length === 0 && (
                    <div className="bg-white p-12 rounded-lg shadow-md text-center">
                      <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <h2 className="text-2xl font-semibold mb-2">
                        Não encontramos nenhum pedido
                      </h2>
                      <p className="text-gray-600 mb-6">
                        Parece que você não efetuou nenhum pedido em nosso site.
                      </p>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
                        <Link to="/produtos">Ver produtos</Link>
                      </button>
                    </div>
                  )}
                  {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              </Tabs.Content>

              <Tabs.Content value="addresses">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Gerenciar Endereços
                  </h3>

                  {addresses.map((address) => (
                    <AddressCard
                      key={address.id}
                      address={address}
                      onRemoveAddress={(id) => {
                        const newAddress = addresses.filter((a) => a.id !== id);
                        setAddresses(newAddress);
                      }}
                      onUpdateAddress={(newAddress) => {
                        const newAddresses = addresses.map((a) => {
                          if (a.id === newAddress.id) return newAddress;
                          return a;
                        });
                        setAddresses(newAddresses);
                      }}
                    />
                  ))}

                  <AddressForm
                    onAddAddress={(newAddress) => {
                      setAddresses((prev) => [...prev, newAddress]);
                    }}
                  />
                </div>
              </Tabs.Content>

              <Tabs.Content value="security">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Alterar Senha</h3>
                  <ChangePasswordForm />
                </div>
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
