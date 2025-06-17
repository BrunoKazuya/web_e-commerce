import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { ArrowLeft } from "lucide-react";
import { useUser } from "../../contexts/UserContext";
import UserForm from "../../components/user/UserForm";
import { useState } from "react";

const UserNew = () => {
  const { addUser, isEmailValid } = useUser();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const successMessage = "Usuário adicionado"
  const add = (newUser) => {
    if (isEmailValid(newUser.email)) {
      if (newUser.password === newUser.confirmPassword) {
        addUser(newUser);
        setSuccess(true);
        setError(false);
      }else{
        setError(true);
      setErrorMessage("As senhas não são iguais");
      setSuccess(false);
      }
    } else {
      setError(true);
      setErrorMessage("Esse email já existe");
      setSuccess(false);
    }
  };

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
            {error && (
              <div className="bg-red-200 w-full text-red-500 py-2 rounded-lg text-center">
                {errorMessage}
              </div>
            )}
            {success && (
              <div className="bg-green-200 w-full text-green-500 py-2 rounded-lg text-center">
                {successMessage}
              </div>
            )}
            <UserForm isAdd={true} add={(newUser) => add(newUser)} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserNew;
