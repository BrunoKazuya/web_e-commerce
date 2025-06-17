import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Mail, Phone, Shield } from "lucide-react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Loading from "../../components/ui/Loading";
import apiClient from "../../utils/apiClient";
import UserRoleForm from "../../components/user/UserRoleForm"; // Importe o novo formulário

const UserUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (!id) {
        navigate('/dashboard/usuarios');
        return;
      }
      try {
        // Busca os dados do usuário específico pela rota de admin
        const userData = await apiClient(`/users/admin/${id}`);
        setUser(userData);
      } catch (err) {
        setError("Não foi possível carregar os dados do usuário.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, [id, navigate]);

  const handleUpdateUserRole = async (formData) => {
    setError('');
    setIsSubmitting(true);
    try {
      // Usa a rota de admin para atualizar o usuário
      await apiClient(`/users/admin/${id}`, { method: 'PUT', body: formData });
      alert('Tipo de usuário atualizado com sucesso!');
      navigate('/dashboard/usuarios');
    } catch (err) {
      setError(err.message || "Não foi possível atualizar o usuário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading size="lg" />;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;
  if (!user) return <p className="text-center py-10">Usuário não encontrado.</p>;

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2 py-16">
        <div>
          <Link
            to="/dashboard/usuarios"
            className="flex items-center text-blue-600 hover:text-blue-800 mb-5"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Gerenciamento de Usuários
          </Link>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-2">Editando Usuário: {user.name}</h1>
            <p className="text-gray-600 mb-6">Altere o tipo de conta do usuário.</p>
            
            {/* Seção de Informações Pessoais (somente leitura) */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-3 text-gray-500" />
                <span className="text-gray-800">{user.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-3 text-gray-500" />
                <span className="text-gray-800">{user.phone}</span>
              </div>
               <div className="flex items-center">
                <Shield className="h-4 w-4 mr-3 text-gray-500" />
                <span className="text-gray-800">Cadastrado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md my-4 text-center">
                {error}
              </div>
            )}
            
            {/* Formulário focado apenas na edição do 'role' */}
            <UserRoleForm
              currentUserRole={user.role}
              onFormSubmit={handleUpdateUserRole}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserUpdate;