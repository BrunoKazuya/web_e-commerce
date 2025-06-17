import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Edit, Trash2, User } from "lucide-react";
import Loading from "../../components/ui/Loading";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import apiClient from "../../utils/apiClient";
import { useAuth } from "../../contexts/AuthContext"; // Para pegar o ID do admin logado

const UserManagement = () => {
  const { user: adminUser } = useAuth(); // Pega o usuário admin logado
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Usa a rota de admin para buscar todos os usuários
      const fetchedUsers = await apiClient('/users/admin/all');
      setUsers(fetchedUsers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRemoveUser = async (userId) => {
    if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
      try {
        await apiClient(`/users/admin/${userId}`, { method: 'DELETE' });
        // Atualiza a UI otimisticamente
        setUsers(currentUsers => currentUsers.filter(u => u._id !== userId));
      } catch (err) {
        alert(`Erro ao deletar usuário: ${err.message}`);
      }
    }
  };

  const filteredUsers = useMemo(() =>
    users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ), [users, searchTerm]);

  if (loading) return <Loading size="lg" />;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
            <p className="text-gray-600">Adicione, edite ou remova usuários.</p>
          </div>
          <Link to="/dashboard/usuarios/novo" className="bg-blue-600 hover:bg-blue-800 rounded-lg flex text-white items-center py-2 px-3">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Usuário
          </Link>
        </div>

        {/* Search e Tabela */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          {/* ... input de busca ... */}
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><User className="h-8 w-8 p-1 bg-gray-100 rounded-full mr-3" />{user.name}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 rounded-full text-xs capitalize ${user.role === 'admin' ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>{user.role}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    {/* Impede que o admin edite ou delete a si mesmo */}
                    {adminUser._id === user._id ? (
                       <span className="text-xs text-gray-400">Ação não permitida</span>
                    ) : (
                      <>
                        <Link to={`/dashboard/usuarios/editar/${user._id}`} className="hover:bg-blue-100 text-blue-600 p-2 rounded-lg"><Edit className="h-4 w-4 inline-block" /></Link>
                        <button onClick={() => handleRemoveUser(user._id)} className="hover:bg-red-100 text-red-600 p-2 rounded-lg ml-2"><Trash2 className="h-4 w-4 inline-block" /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserManagement;