import * as Tabs from "@radix-ui/react-tabs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Package, MapPin, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { ShoppingCart, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import OrderCard from "../components/profile/OrderCard";
import AddressForm from "../components/profile/AddressForm";
import AddressCard from "../components/profile/AddressCard";
import ChangePasswordForm from "../components/profile/ChangePasswordForm";
import ProfileForm from "../components/profile/ProfileForm";
import Loading from "../components/ui/Loading";
import { useAuth } from "../contexts/AuthContext";
import CardManagement from "../components/profile/CardManagement";

const ProfilePage = () => {
  const [tabs, setTabs] = useState("pedidos");
  const { user } = useAuth();
  const {
    getMyOrders,
    getMyAddresses,
    addAddress,
    removeAddress,
    updateAddress,
  } = useUser();

  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersData, addressesData] = await Promise.all([
          getMyOrders(),
          getMyAddresses(),
        ]);
        setOrders(ordersData);
        setAddresses(addressesData);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Não foi possível carregar os dados do perfil.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [getMyOrders, getMyAddresses]);

  const handleAddAddress = async (formData) => {
    try {
      const newAddress = await addAddress(formData);
      setAddresses((prev) => [...prev, newAddress]);
    } catch (err) {
      alert(`Erro: ${err.message}`);
    }
  };

  const handleRemoveAddress = async (id) => {
    if (window.confirm("Tem certeza?")) {
      try {
        await removeAddress(id);
        setAddresses((prev) => prev.filter((a) => a._id !== id));
      } catch (err) {
        alert(`Erro: ${err.message}`);
      }
    }
  };

  const handleUpdateAddress = async (id, formData) => {
    try {
      const updatedAddr = await updateAddress(id, formData);
      setAddresses((prev) => prev.map((a) => (a._id === id ? updatedAddr : a)));
    } catch (err) {
      alert(`Erro: ${err.message}`);
    }
  };

  if (loading) return <Loading size="lg" />;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

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
              <Tabs.List className="grid grid-cols-1 sm:grid-cols-4 mb-8 w-full bg-gray-100 rounded-lg p-1">
                <Tabs.Trigger
                  value="orders"
                  className={`flex items-center py-1 px-2 text-center cursor-pointer ${
                    tabs === "pedidos" ? "bg-white text-black" : "text-gray-400"
                  } rounded-lg`}
                  onClick={() => {setTabs("pedidos")
                  }}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Pedidos
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="addresses"
                  className={`flex items-center py-1 px-2 text-center cursor-pointer ${
                    tabs === "endereco"
                      ? "bg-white text-black"
                      : "text-gray-400"
                  } rounded-lg`}
                  onClick={() => {setTabs("endereco")
                  }}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Endereços
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="cards"
                  className={`flex items-center py-1 px-2 text-center cursor-pointer ${
                    tabs === "cartoes" ? "bg-white text-black" : "text-gray-400"
                  } rounded-lg`}
                  onClick={() => {setTabs("cartoes")
                  }}
                >
                  <CreditCard className="h-4 w-4 mr-2" /> Cartões
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="security"
                  className={`flex items-center py-1 px-2 text-center cursor-pointer ${
                    tabs === "seguranca"
                      ? "bg-white text-black"
                      : "text-gray-400"
                  } rounded-lg`}
                  onClick={() => {setTabs("seguranca")
                  }}
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
                    <OrderCard key={order._id} order={order} />
                  ))}
                </div>
              </Tabs.Content>

              <Tabs.Content value="addresses">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Gerenciar Endereços</h3>
                  {addresses.map((address) => (
                    <AddressCard
                      key={address._id}
                      address={address}
                      onRemove={handleRemoveAddress}
                      onUpdate={handleUpdateAddress}
                    />
                  ))}
                  <AddressForm onFormSubmit={handleAddAddress} />
                </div>
              </Tabs.Content>

              <Tabs.Content value="cards">
                <CardManagement />
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
