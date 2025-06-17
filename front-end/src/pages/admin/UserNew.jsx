// src/pages/admin/UserNew.jsx (Versão Final e Refatorada)

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import UserForm from "../../components/user/UserForm";
import apiClient from "../../utils/apiClient";

const UserNew = () => {
  const navigate = useNavigate();
  
  // Estado local para controlar o envio do formulário
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Função que será passada para o formulário
  const handleAddUser = async (formData) => {
    // Limpa mensagens anteriores e inicia o estado de envio
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);
    
    try {
      // Faz a chamada para a nova rota de admin no back-end
      await apiClient('/users/admin/add', {
        method: 'POST',
        body: formData,
      });
      
      // Se a chamada for bem-sucedida
      setSuccessMessage('Usuário adicionado com sucesso!');
      
      // Aguarda um pouco para o admin ver a mensagem e depois redireciona
      setTimeout(() => {
        navigate('/dashboard/usuarios');
      }, 1500);

    } catch (err) {
      // Se a API retornar um erro (ex: e-mail já existe), ele será exibido
      setError(err.message || 'Não foi possível adicionar o usuário.');
    } finally {
      // Garante que o estado de 'submitting' seja desativado no final
      setIsSubmitting(false);
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

            {/* Exibe a mensagem de erro da API */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center mb-4">
                {error}
              </div>
            )}
            {/* Exibe a mensagem de sucesso */}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center mb-4">
                {successMessage}
              </div>
            )}

            <UserForm
              isAdd={true}
              onFormSubmit={handleAddUser}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserNew;