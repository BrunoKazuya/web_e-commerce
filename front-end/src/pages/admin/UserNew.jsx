// src/pages/admin/UserNew.jsx

import { Link, useNavigate } from "react-router-dom"; // Imports routing components.
import { useState } from "react"; // Imports the useState hook.
import { ArrowLeft } from "lucide-react"; // Imports an icon.
import Footer from "../../components/Footer"; // Imports the Footer component.
import Navbar from "../../components/Navbar"; // Imports the Navbar component.
import UserForm from "../../components/user/UserForm"; // Imports the reusable user form.
import apiClient from "../../utils/apiClient"; // Imports the API client.

const UserNew = () => { // Defines the component for adding a new user.
  const navigate = useNavigate(); // Initializes the navigate function.
  
  // Local state to control the form submission.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Function that will be passed to the form.
  const handleAddUser = async (formData) => {
    // Clears previous messages and starts the submitting state.
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);
    
    try {
      // Makes the call to the new admin route on the backend.
      await apiClient('/users/admin/add', {
        method: 'POST',
        body: formData,
      });
      
      // If the call is successful.
      setSuccessMessage('Usuário adicionado com sucesso!');
      
      // Waits a bit for the admin to see the message and then redirects.
      setTimeout(() => {
        navigate('/dashboard/usuarios');
      }, 1500);

    } catch (err) {
      // If the API returns an error (e.g., email already exists), it will be displayed.
      setError(err.message || 'Não foi possível adicionar o usuário.');
    } finally {
      // Ensures the 'submitting' state is deactivated at the end.
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-2xl font-bold mb-6">Adicionar Novo Usuário</h1>

            {/* Displays the API error message. */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center mb-4">
                {error}
              </div>
            )}
            {/* Displays the success message. */}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center mb-4">
                {successMessage}
              </div>
            )}

            <UserForm // Renders the reusable form.
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

export default UserNew; // Exports the component.