import { Link, useParams, useNavigate } from "react-router-dom"; // Imports routing hooks.
import { useEffect, useState } from "react"; // Imports React hooks.
import { ArrowLeft } from "lucide-react"; // Imports an icon.
import Footer from "../../components/Footer"; // Imports the Footer component.
import Navbar from "../../components/Navbar"; // Imports the Navbar component.
import Loading from "../../components/ui/Loading"; // Imports the loading spinner.
import apiClient from "../../utils/apiClient"; // Imports the API client.
import CategoryForm from "../../components/category/CategoryForm"; // Imports the reusable category form.

const CategoryUpdate = () => { // Defines the component for updating a category.
  const { id } = useParams(); // Gets the category ID from the URL parameters.
  const navigate = useNavigate(); // Initializes the navigate function.
  
  const [category, setCategory] = useState(null); // State to hold the category data to be edited.
  const [loading, setLoading] = useState(true); // State to manage loading status.
  const [error, setError] = useState(''); // State to hold error messages.
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track form submission.

  useEffect(() => { // Effect to load the specific category's data.
    const loadCategoryData = async () => {
      if (!id) return navigate('/dashboard/categorias'); // Redirects if no ID is present.
      try {
        const data = await apiClient(`/categories/${id}`); // Fetches the category by its ID.
        setCategory(data); // Sets the fetched data to state.
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Não foi possível carregar a categoria."); // Sets an error on failure.
      } finally {
        setLoading(false); // Sets loading to false.
      }
    };
    loadCategoryData();
  }, [id, navigate]); // Runs when the 'id' changes.

  const handleUpdateCategory = async (formData) => { // Defines an async function to handle the update.
    setError(''); // Clears previous errors.
    setIsSubmitting(true); // Sets submitting state to true.
    try {
      await apiClient(`/categories/${id}`, { method: 'PUT', body: formData }); // Calls the API to update the category.
      alert('Categoria atualizada com sucesso!'); // Shows a success alert.
      navigate('/dashboard/categorias'); // Navigates back to the management page.
    } catch (err) {
      setError(err.message || 'Não foi possível atualizar a categoria.'); // Sets an error on failure.
    } finally {
      setIsSubmitting(false); // Sets submitting state back to false.
    }
  };

  if (loading) return <Loading size="lg" />; // Shows a loading spinner while fetching.
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>; // Shows an error message if fetching fails.

  return ( // Returns the JSX for the page.
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-16"> {/* Main content container. */}
        <Link to="/dashboard/categorias" className="flex items-center text-blue-600 hover:text-blue-800 mb-5"> {/* "Back" link. */}
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Gerenciamento de Categorias
        </Link>
        <div className="bg-white rounded-lg shadow-md p-6"> {/* Card container for the form. */}
          <h1 className="text-2xl font-bold mb-6">Editar Categoria</h1> {/* Page title. */}
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</div>} {/* Displays any submission error. */}
          <CategoryForm // Renders the reusable form component.
            isAdd={false} // Specifies that this is an "edit" operation.
            category={category} // Passes the current category data to pre-fill the form.
            onFormSubmit={handleUpdateCategory} // Passes the update handler function.
            isSubmitting={isSubmitting} // Passes the submitting state.
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryUpdate; // Exports the component.