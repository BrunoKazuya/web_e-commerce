import { Link, useNavigate } from "react-router-dom"; // Imports routing components.
import { useState } from "react"; // Imports the useState hook.
import { ArrowLeft } from "lucide-react"; // Imports an icon.
import Footer from "../../components/Footer"; // Imports the Footer component.
import Navbar from "../../components/Navbar"; // Imports the Navbar component.
import apiClient from "../../utils/apiClient"; // Imports the API client.
import CategoryForm from "../../components/category/CategoryForm"; // Imports the reusable category form.

const CategoryNew = () => { // Defines the component for adding a new category.
  const navigate = useNavigate(); // Initializes the navigate function.
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track form submission status.
  const [error, setError] = useState(''); // State to hold any submission errors.

  const handleAddCategory = async (formData) => { // Defines an async function to handle form submission.
    setError(''); // Clears any previous errors.
    setIsSubmitting(true); // Sets submitting state to true.
    try {
      await apiClient('/categories', { method: 'POST', body: formData }); // Calls the API to create the new category.
      alert('Categoria adicionada com sucesso!'); // Shows a success alert.
      navigate('/dashboard/categorias'); // Navigates back to the category management page.
    } catch (err) {
      setError(err.message || 'Não foi possível adicionar a categoria.'); // Sets an error message on failure.
    } finally {
      setIsSubmitting(false); // Sets submitting state back to false.
    }
  };

  return ( // Returns the JSX for the page.
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-16"> {/* Main content container. */}
        <Link to="/dashboard/categorias" className="flex items-center text-blue-600 hover:text-blue-800 mb-5"> {/* "Back" link. */}
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Gerenciamento de Categorias
        </Link>
        <div className="bg-white rounded-lg shadow-md p-6"> {/* Card container for the form. */}
          <h1 className="text-2xl font-bold mb-6">Adicionar Nova Categoria</h1> {/* Page title. */}
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</div>} {/* Displays any submission error. */}
          <CategoryForm // Renders the reusable form component.
            isAdd={true} // Specifies that this is an "add" operation.
            onFormSubmit={handleAddCategory} // Passes the submit handler function.
            isSubmitting={isSubmitting} // Passes the submitting state.
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryNew; // Exports the component.