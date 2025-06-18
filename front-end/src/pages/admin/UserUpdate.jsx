import { Link, useParams, useNavigate } from "react-router-dom"; // Imports routing hooks.
import { useEffect, useState } from "react"; // Imports React hooks.
import { ArrowLeft, Mail, Phone, Shield } from "lucide-react"; // Imports icons.
import Footer from "../../components/Footer"; // Imports the Footer component.
import Navbar from "../../components/Navbar"; // Imports the Navbar component.
import Loading from "../../components/ui/Loading"; // Imports the loading spinner.
import apiClient from "../../utils/apiClient"; // Imports the API client.
import UserRoleForm from "../../components/user/UserRoleForm"; // Imports the new form for role editing.

const UserUpdate = () => { // Defines the component for updating a user.
  const { id } = useParams(); // Gets the user ID from the URL.
  const navigate = useNavigate(); // Initializes the navigate function.

  const [user, setUser] = useState(null); // State for the user data to be edited.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { // Effect to load the specific user's data.
    const loadUserData = async () => {
      if (!id) {
        navigate('/dashboard/usuarios');
        return;
      }
      try {
        // Fetches the specific user's data via the admin route.
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
  }, [id, navigate]); // Runs when 'id' changes.

  const handleUpdateUserRole = async (formData) => { // Defines an async function to handle the role update.
    setError('');
    setIsSubmitting(true);
    try {
      // Uses the admin route to update the user.
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

  return ( // Returns the JSX for the page.
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
            
            {/* Personal Information Section (read-only) */}
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

            {error && ( // Displays any submission error.
              <div className="bg-red-100 text-red-700 p-3 rounded-md my-4 text-center">
                {error}
              </div>
            )}
            
            {/* Form focused only on editing the 'role' */}
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