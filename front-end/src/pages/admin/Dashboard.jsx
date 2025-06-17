import { Link } from "react-router-dom";
import { Card, Text, Box } from "@radix-ui/themes";
import { ShoppingBag, Users, CreditCard, Package, BarChart3, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import apiClient from "../../utils/apiClient";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/ui/Loading";

const Dashboard = () => {
  // Estado para armazenar os dados dinâmicos do dashboard
  const [stats, setStats] = useState({
    revenue: 0,
    ordersCount: 0,
    productsCount: 0,
    usersCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Usamos Promise.all para buscar todos os dados em paralelo
        const [ordersData, usersData, productsData] = await Promise.all([
          apiClient('/orders'), // Rota de admin que busca todos os pedidos
          apiClient('/users/admin/all'), // Rota de admin que busca todos os usuários
          apiClient('/products'), // Rota pública para buscar todos os produtos
        ]);

        // Calcula a receita total a partir dos pedidos com status "paid"
        const totalRevenue = ordersData
          .reduce((acc, order) => acc + order.totalPrice, 0);
        
        // Pega os 5 pedidos mais recentes (ordem decrescente de data)
        const sortedOrders = ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentOrders(sortedOrders.slice(0, 5));

        // Atualiza o estado com os dados calculados e contagens
        setStats({
          revenue: totalRevenue,
          ordersCount: ordersData.length,
          productsCount: productsData.length,
          usersCount: usersData.length,
        });

      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
        setError("Não foi possível carregar os dados. Verifique se você tem permissão de administrador.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Exibe o componente de Loading enquanto os dados são buscados
  if (loading) {
    return <Loading size="lg" />;
  }

  // Exibe uma mensagem de erro se a busca falhar
  if (error) {
    return <p className="text-center text-red-500 py-10">{error}</p>;
  }

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
            <Link to="/dashboard/produtos/novo" className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-800 cursor-pointer">
              Adicionar Novo Produto
            </Link>
          </div>
        </div>

        {/* Cards de Resumo agora com dados dinâmicos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border border-gray-200 p-5 rounded-lg">
            <div className="flex items-center justify-between pb-2"><Text size="2" weight="medium">Receita Total</Text><CreditCard className="h-4 w-4 text-gray-500" /></div>
            <Box><div className="text-2xl font-bold">{stats.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div></Box>
          </Card>

          <Card className="border border-gray-200 p-5 rounded-lg">
            <div className="flex items-center justify-between pb-2"><Text size="2" weight="medium">Total de Pedidos</Text><ShoppingBag className="h-4 w-4 text-gray-500" /></div>
            <Box><div className="text-2xl font-bold">{stats.ordersCount}</div></Box>
          </Card>

          <Card className="border border-gray-200 p-5 rounded-lg">
            <div className="flex items-center justify-between pb-2"><Text size="2" weight="medium">Produtos</Text><Package className="h-4 w-4 text-gray-500" /></div>
            <Box><div className="text-2xl font-bold">{stats.productsCount}</div></Box>
          </Card>

          <Card className="border border-gray-200 p-5 rounded-lg">
            <div className="flex items-center justify-between pb-2"><Text size="2" weight="medium">Usuários</Text><Users className="h-4 w-4 text-gray-500" /></div>
            <Box><div className="text-2xl font-bold">{stats.usersCount}</div></Box>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Card de Gráfico (placeholder) */}
          <Card className="border border-gray-200 p-5 rounded-lg">
            <Text size="3" weight="medium">Visão Geral de Vendas</Text>
            <Box className="h-80 flex items-center justify-center bg-slate-50 rounded-lg mt-4"><BarChart3 className="h-24 w-24 text-slate-300" /></Box>
          </Card>

          {/* Card de Pedidos Recentes (agora dinâmico) */}
          <Card className="border border-gray-200 p-5 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Text size="3" weight="medium">Pedidos Recentes</Text>
                <p className="text-sm text-gray-500">Os últimos 5 pedidos</p>
              </div>
            </div>
            <Box className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Pedido #{order._id.substring(0, 7)}...</p>
                    <p className="text-sm text-gray-600">{order.user?.name || 'Usuário Removido'}</p>
                  </div>
                  <div className="ml-auto flex flex-col items-end">
                    <p className="font-medium">{order.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    <p className="text-xs mt-1 text-gray-500">{new Date(order.createdAt).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && <p className="text-sm text-gray-500 text-center py-4">Nenhum pedido recente.</p>}
            </Box>
          </Card>
        </div>
        
        {/* Links de Gestão */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <Card className="border border-gray-200 p-5 rounded-lg">
            <Text size="3" weight="medium" className="flex items-center">
              <Users className="mr-2 h-5 w-5" /> Gestão de Categorias
            </Text>
            <Box className="space-y-2">
              <Link to="/dashboard/categorias">
                <button className="border border-gray-200 text-gray-800 rounded-lg w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-100 my-4">
                  Ver Todas Caregorias
                </button>
              </Link>
              <Link to="/dashboard/categorias/novo">
                <button className="border border-gray-200 text-gray-800 rounded-lg w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-100">
                  Adicionar Nova Categoria
                </button>
              </Link>
            </Box>
          </Card>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Dashboard;
