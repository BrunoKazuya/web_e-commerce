import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Package, MapPin, Lock } from 'lucide-react';

const ProfilePage = () => {
  // Mock data - replace with real data later
  const userProfile = {
    name: "John Doe",
    email: "john@example.com",
    addresses: [
      {
        id: 1,
        street: "123 Main St",
        city: "Sample City",
        state: "ST",
        zipCode: "12345"
      }
    ],
    orders: [
      {
        id: "ORD001",
        date: "2024-04-25",
        status: "Delivered",
        total: 99.99
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Meu Perfil</h1>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Informações da Conta</h2>
              <p><strong>Nome:</strong> {userProfile.name}</p>
              <p><strong>E-mail:</strong> {userProfile.email}</p>
            </div>

            <Tabs.Root defaultValue="orders" className="mt-6">
              <Tabs.List className="flex space-x-4">
                <Tabs.Trigger value="orders" className="flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  Pedidos
                </Tabs.Trigger>
                <Tabs.Trigger value="addresses" className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Endereços
                </Tabs.Trigger>
                <Tabs.Trigger value="security" className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Segurança
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="orders">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">Histórico de Pedidos</h3>
                  {userProfile.orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Pedido #{order.id}</p>
                          <p className="text-sm text-gray-600">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R${order.total}</p>
                          <p className="text-sm text-green-600">
                            {order.status === 'Delivered' ? 'Entregue' : order.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Tabs.Content>

              <Tabs.Content value="addresses">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold mb-4">Gerenciar Endereços</h3>

                  {userProfile.addresses.map((address) => (
                    <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state} {address.zipCode}</p>
                      <div className="mt-4 flex gap-2">
                        <button type="button">Editar</button>
                        <button type="button">Remover</button>
                      </div>
                    </div>
                  ))}

                  <form className="border border-gray-200 rounded-lg p-4 mt-4">
                    <h4 className="font-semibold mb-4">Adicionar Novo Endereço</h4>
                    <div className="grid gap-4">
                      <input placeholder="Endereço" />
                      <div className="grid grid-cols-2 gap-4">
                        <input placeholder="Cidade" />
                        <input placeholder="Estado" />
                      </div>
                      <input placeholder="CEP" />
                      <button type="submit">Adicionar Endereço</button>
                    </div>
                  </form>
                </div>
              </Tabs.Content>

              <Tabs.Content value="security">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Alterar Senha</h3>
                  <form className="max-w-md space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Senha Atual
                      </label>
                      <input className='border rounded-lg'  type="password" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Nova Senha
                      </label>
                      <input className='border rounded-lg' type="password" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Confirmar Nova Senha
                      </label>
                      <input className='border rounded-lg' type="password" />
                    </div>
                    <button className='button' type="submit">Atualizar Senha</button>
                  </form>
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
