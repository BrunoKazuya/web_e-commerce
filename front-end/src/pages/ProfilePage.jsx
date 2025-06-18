import * as Tabs from "@radix-ui/react-tabs"; // Imports Radix UI Tabs components.
import Navbar from "../components/Navbar"; // Imports the Navbar component.
import Footer from "../components/Footer"; // Imports the Footer component.
import { Package, MapPin, Lock, ShoppingCart, CreditCard } from "lucide-react"; // Imports icons.
import { useEffect, useState } from "react"; // Imports React hooks.
import { Link } from "react-router-dom"; // Imports Link for navigation.
import { useUser } from "../contexts/UserContext"; // Imports the user context hook.
import OrderCard from "../components/profile/OrderCard"; // Imports the component for displaying a single order.
import AddressCard from "../components/profile/AddressCard"; // Imports the component for displaying a single address.
import AddressForm from "../components/profile/AddressForm"; // Imports the form for adding/editing an address.
import ChangePasswordForm from "../components/profile/ChangePasswordForm"; // Imports the password change form.
import ProfileForm from "../components/profile/ProfileForm"; // Imports the profile info form.
import Loading from "../components/ui/Loading"; // Imports the loading spinner.
import { useAuth } from "../contexts/AuthContext"; // Imports the auth context hook.
import CardManagement from "../components/profile/CardManagement"; // Imports the component for managing credit cards.

const ProfilePage = () => { // Defines the ProfilePage component.
  const [tabs, setTabs] = useState("pedidos"); // State to manage the currently active tab.
  const { user } = useAuth(); // Gets the current user from the auth context.
  const { // Destructures API functions from the user context.
    getMyOrders,
    getMyAddresses,
    addAddress,
    removeAddress,
    updateAddress,
  } = useUser();

  const [orders, setOrders] = useState([]); // State for the user's orders.
  const [addresses, setAddresses] = useState([]); // State for the user's addresses.
  const [loading, setLoading] = useState(true); // State to manage loading status.
  const [error, setError] = useState(""); // State to hold any error message.

  useEffect(() => { // Effect to load initial profile data.
    const loadData = async () => {
      try {
        const [ordersData, addressesData] = await Promise.all([ // Fetches orders and addresses in parallel.
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
  }, [getMyOrders, getMyAddresses]); // Dependency array.

  const handleAddAddress = async (formData) => { // Function to handle adding a new address.
    try {
      const newAddress = await addAddress(formData);
      setAddresses((prev) => [...prev, newAddress]); // Adds the new address to the state.
    } catch (err) {
      alert(`Erro: ${err.message}`);
    }
  };

  const handleRemoveAddress = async (id) => { // Function to handle removing an address.
    if (window.confirm("Tem certeza?")) {
      try {
        await removeAddress(id);
        setAddresses((prev) => prev.filter((a) => a._id !== id)); // Filters out the removed address from the state.
      } catch (err) {
        alert(`Erro: ${err.message}`);
      }
    }
  };

  const handleUpdateAddress = async (id, formData) => { // Function to handle updating an address.
    try {
      const updatedAddr = await updateAddress(id, formData);
      setAddresses((prev) => prev.map((a) => (a._id === id ? updatedAddr : a))); // Updates the specific address in the state.
    } catch (err) {
      alert(`Erro: ${err.message}`);
    }
  };

  if (loading) return <Loading size="lg" />; // Shows loading spinner while data is being fetched.
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>; // Shows an error message if fetching fails.

  return ( // Returns the JSX for the page.
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

            <Tabs.Root defaultValue="orders" className="mt-6"> {/* Main container for the tabbed interface. */}
              <Tabs.List className="grid grid-cols-1 sm:grid-cols-4 mb-8 w-full bg-gray-100 rounded-lg p-1"> {/* List of tab triggers. */}
                <Tabs.Trigger
                  value="orders"
                  className={`flex items-center justify-center py-1 px-2 text-center cursor-pointer ${
                    tabs === "pedidos" ? "bg-white text-black" : "text-gray-400"
                  } rounded-lg`}
                  onClick={() => {setTabs("pedidos")}}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Pedidos
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="addresses"
                  className={`flex items-center justify-center py-1 px-2 text-center cursor-pointer ${
                    tabs === "endereco" ? "bg-white text-black" : "text-gray-400"
                  } rounded-lg`}
                  onClick={() => {setTabs("endereco")}}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Endereços
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="cards"
                  className={`flex items-center justify-center py-1 px-2 text-center cursor-pointer ${
                    tabs === "cartoes" ? "bg-white text-black" : "text-gray-400"
                  } rounded-lg`}
                  onClick={() => {setTabs("cartoes")}}
                >
                  <CreditCard className="h-4 w-4 mr-2" /> Cartões
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="security"
                  className={`flex items-center justify-center py-1 px-2 text-center cursor-pointer ${
                    tabs === "seguranca" ? "bg-white text-black" : "text-gray-400"
                  } rounded-lg`}
                  onClick={() => {setTabs("seguranca")}}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Segurança
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="orders"> {/* Content for the "Orders" tab. */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">
                    Histórico de Pedidos
                  </h3>
                  {orders.length === 0 && ( // Renders a message if there are no orders.
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

              <Tabs.Content value="addresses"> {/* Content for the "Addresses" tab. */}
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

              <Tabs.Content value="cards"> {/* Content for the "Cards" tab. */}
                <CardManagement />
              </Tabs.Content>

              <Tabs.Content value="security"> {/* Content for the "Security" tab. */}
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