import { Link } from "react-router-dom";
import { Card, Text, Box } from "@radix-ui/themes";
import {
  ShoppingBag,
  Users,
  CreditCard,
  Package,
  BarChart3,
  ArrowRight,
} from "lucide-react";

import Navbar from "../../components/Navbar";

const Dashboard = () => {
  const summary = {
    revenue: "R$ 45.231,89",
    orders: "573",
    products: "247",
    users: "2415",
  };

  const recentOrders = [
    {
      id: "12345",
      total: "R$ 120,00",
      status: "Concluído",
      date: "01/05/2025",
    },
    {
      id: "12346",
      total: "R$ 85,50",
      status: "Processando",
      date: "30/04/2025",
    },
    {
      id: "12347",
      total: "R$ 230,10",
      status: "Concluído",
      date: "28/04/2025",
    },
    { id: "12348", total: "R$ 60,75", status: "Pendente", date: "25/04/2025" },
  ];

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
            <p className="text-gray-600">Bem-vindo de volta, Admin</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/dashboard/produtos/novo">
              <button className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-800 cursor-pointer">
                Adicionar Novo Produto
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border border-gray-200 p-5 rounded-lg">
            <div className="flex flex-row items-center justify-between pb-2">
              <Text as="div" size="2" weight="medium">
                Receita Total
              </Text>
              <CreditCard className="h-4 w-4" />
            </div>
            <Box>
              <div className="text-2xl font-bold">{summary.revenue}</div>
              <p className="text-xs mt-1">+20,1% em relação ao mês passado</p>
            </Box>
          </Card>

          <Card className="border border-gray-200 p-5 rounded-lg">
            <div className="flex flex-row items-center justify-between pb-2">
              <Text as="div" size="2" weight="medium">
                Total de Pedidos
              </Text>
              <ShoppingBag className="h-4 w-4" />
            </div>
            <Box>
              <div className="text-2xl font-bold">{summary.orders}</div>
              <p className="text-xs mt-1">+12,4% em relação ao mês passado</p>
            </Box>
          </Card>

          <Card className="border border-gray-200 p-5 rounded-lg">
            <div className="flex flex-row items-center justify-between pb-2">
              <Text as="div" size="2" weight="medium">
                Produtos
              </Text>
              <Package className="h-4 w-4" />
            </div>
            <Box>
              <div className="text-2xl font-bold">{summary.products}</div>
              <p className="text-xs mt-1">+4 novos este mês</p>
            </Box>
          </Card>

          <Card className="border border-gray-200 p-5 rounded-lg">
            <div className="flex flex-row items-center justify-between pb-2">
              <Text as="div" size="2" weight="medium">
                Usuários Ativos
              </Text>
              <Users className="h-4 w-4" />
            </div>
            <Box>
              <div className="text-2xl font-bold">{summary.users}</div>
              <p className="text-xs mt-1">+5,3% em relação ao mês passado</p>
            </Box>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="border border-gray-200 p-5 rounded-lg">
            <div>
              <Text size="3" weight="medium">
                Visão Geral de Vendas
              </Text>
              <p className="text-sm text-gray-500">
                Comparação de vendas do mês atual e anterior
              </p>
            </div>
            <Box>
              <div className="h-80 flex items-center justify-center bg-slate-50 rounded-lg">
                <BarChart3 className="h-24 w-24 text-slate-300" />
                <span className="ml-2 text-slate-500">
                  Gráfico aparecerá aqui
                </span>
              </div>
            </Box>
          </Card>

          <Card className="border border-gray-200 p-5 rounded-lg">
            <div className="flex flex-row items-center justify-between">
              <div>
                <Text size="3" weight="medium">
                  Pedidos Recentes
                </Text>
                <p className="text-sm text-gray-500">
                  Pedidos mais recentes dos clientes
                </p>
              </div>
              <button className="text-blue-600 rounded-lg px-3 py-1 text-sm flex items-center">
                Ver Todos <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
            <Box className="space-y-8">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Pedido #{order.id}
                    </p>
                    <p className="text-sm">{order.total}</p>
                  </div>
                  <div className="ml-auto flex flex-col items-end">
                    <div
                      className={`px-2 py-1 text-xs rounded-lg ${
                        order.status === "Pendente"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "Concluído"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {order.status}
                    </div>
                    <p className="text-xs mt-1">{order.date}</p>
                  </div>
                </div>
              ))}
            </Box>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-gray-200 p-5 rounded-lg">
            <Text size="3" weight="medium" className="flex items-center">
              <Package className="mr-2 h-5 w-5" /> Gestão de Produtos
            </Text>
            <Box className="space-y-2">
              <Link to="/dashboard/produtos">
                <button className="border border-gray-200 text-gray-800 rounded-lg w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-100 my-4">
                  Ver Todos os Produtos
                </button>
              </Link>
              <Link to="/dashboard/produtos/novo">
                <button className="border border-gray-200 text-gray-800 rounded-lg w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-100">
                  Adicionar Novo Produto
                </button>
              </Link>
            </Box>
          </Card>

          <Card className="border border-gray-200 p-5 rounded-lg">
            <Text size="3" weight="medium" className="flex items-center">
              <Users className="mr-2 h-5 w-5" /> Gestão de Usuários
            </Text>
            <Box className="space-y-2">
              <Link to="/dashboard/usuarios">
                <button className="border border-gray-200 text-gray-800 rounded-lg w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-100 my-4">
                  Ver Todos os Usuários
                </button>
              </Link>
              <Link to="/dashboard/usuarios/novo">
                <button className="border border-gray-200 text-gray-800 rounded-lg w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-100">
                  Adicionar Novo Usuário
                </button>
              </Link>
            </Box>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
