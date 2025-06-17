import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { ArrowLeft } from "lucide-react";
import { useUser } from "../../contexts/UserContext";
import UserForm from "../../components/user/UserForm";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/ui/Loading";
const UserUpdate = () => {
  const { id } = useParams();
  const { updateUser, getUserById } = useUser();
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const successMessage = "Usuário atualizado";
  const update = (newUser) => {
    updateUser(newUser);
    setSuccess(true);
  };

  useEffect(() => {
    async function load() {
      try {
        const fetched = await getUserById(id);
        setUser(fetched);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    load()
  }, []);

  if(loading){
    return <Loading size="lg"/>
  }

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
            <h1 className="text-2xl font-bold mb-6">Adicionar Novo Usuário</h1>
            {success && (
              <div className="bg-green-200 w-full text-green-500 py-2 rounded-lg text-center">
                {successMessage}
              </div>
            )}
            <UserForm
              isAdd={false}
              update={(newUser) => update(newUser)}
              user={user}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserUpdate;
