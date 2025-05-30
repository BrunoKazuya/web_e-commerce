import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Edit, Trash2, User} from "lucide-react";
import { useUser } from "../../contexts/UserContext";
import Loading from "../../components/ui/Loading";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
const UserManagement = () => {
  const { getUsers, removeUser } = useUser();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const remove = (id) => {
    const newUsers = users.filter((u) => u.id !== id);
    setUsers(newUsers);
    removeUser(id);
  };

  useEffect(() => {
    async function load() {
      try {
        const fetched = await getUsers();
        setUsers(fetched);
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
    <>
    <Navbar/>
    <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
          <p className="text-gray-600">Gerencie usuários do sistema</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to={"/dashboard/usuarios/novo"} className="bg-blue-600 hover:bg-blue-800 rounded-lg flex text-white items-center py-2 px-3 cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Usuário
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            placeholder="Buscar usuários..."
            className="w-full px-3 py-2 border rounded-lg border-gray-300  focus:outline-none focus:border-gray-400 pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telefone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de Cadastro
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="h-8 w-8 p-1 bg-gray-100 rounded-full mr-3" />
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.role === "Admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 flex">
                  {user.id === 1 && (
                    <button
                      className={`p-2 rounded-lg ${
                        user.id === 1
                          ? "cursor-not-allowed text-blue-400"
                          : "hover:bg-blue-100 text-blue-600 cursor-pointer"
                      }`}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                  {user.id !==1 && (
                      <Link to={`/dashboard/usuarios/editar/${user.id}`}
                        className={`p-2 rounded-lg ${
                          user.id === 1
                            ? "cursor-not-allowed text-blue-400"
                            : "hover:bg-blue-100 text-blue-600 cursor-pointer"
                        }`}
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    )}
                  <button
                    className={`p-2 rounded-lg ${
                      user.id === 1
                        ? "cursor-not-allowed text-red-400"
                        : "hover:bg-red-100 text-red-600 cursor-pointer"
                    }`}
                    onClick={() => {
                      if (user.id !== 1) remove(user.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum usuário encontrado.
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default UserManagement;
