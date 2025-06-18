import { useEffect, useState } from "react"; // Imports React hooks for state and side effects.
import { Link } from "react-router-dom"; // Imports the Link component for navigation.
import { Plus, Edit, Trash2, Tag } from "lucide-react"; // Imports icons from the lucide-react library.
import Loading from "../../components/ui/Loading"; // Imports the loading spinner component.
import Footer from "../../components/Footer"; // Imports the Footer component.
import Navbar from "../../components/Navbar"; // Imports the Navbar component.
import apiClient from "../../utils/apiClient"; // Imports the pre-configured API client.

const CategoryManagement = () => { // Defines the CategoryManagement admin page component.
  const [categories, setCategories] = useState([]); // State to store the list of categories.
  const [loading, setLoading] = useState(true); // State to manage the loading status.
  const [error, setError] = useState(null); // State to store any error messages.

  const fetchCategories = async () => { // Defines an async function to fetch all categories.
    setLoading(true); // Sets loading to true before the API call.
    try {
      const data = await apiClient('/categories'); // Fetches data from the categories endpoint.
      setCategories(data); // Sets the fetched data into state.
    } catch (err) {
      setError(err.message); // Sets an error message if the API call fails.
    } finally {
      setLoading(false); // Sets loading to false after the operation is complete.
    }
  };

  useEffect(() => { // Effect hook to run the fetch operation when the component mounts.
    fetchCategories();
  }, []); // Empty dependency array ensures this runs only once.

  const handleRemove = async (id) => { // Defines an async function to handle category removal.
    if (window.confirm('Tem certeza que deseja deletar esta categoria? Produtos associados perderão sua categoria.')) { // Asks for user confirmation.
      try {
        await apiClient(`/categories/${id}`, { method: 'DELETE' }); // Calls the API to delete the category.
        setCategories(current => current.filter(c => c._id !== id)); // Updates the UI optimistically by filtering out the removed category.
      } catch (err) {
        alert(`Erro ao deletar: ${err.message}`); // Shows an alert if the deletion fails.
      }
    }
  };

  if (loading) return <Loading size="lg" />; // Shows a loading spinner while data is being fetched.
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>; // Shows an error message if fetching fails.

  return ( // Returns the JSX for the page.
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10"> {/* Main content container. */}
        <div className="flex justify-between items-center mb-8"> {/* Page header. */}
          <div>
            <h1 className="text-3xl font-bold">Gerenciamento de Categorias</h1> {/* Page title. */}
            <p className="text-gray-600">Adicione, edite ou remova categorias.</p> {/* Page subtitle. */}
          </div>
          <Link to="/dashboard/categorias/novo" className="bg-blue-600 hover:bg-blue-800 rounded-lg flex text-white items-center py-2 px-3"> {/* Link to add a new category. */}
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Categoria
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden border"> {/* Container for the categories table. */}
          <table className="min-w-full divide-y divide-gray-200"> {/* The table element. */}
            <thead className="bg-gray-50"> {/* Table header. */}
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome da Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200"> {/* Table body. */}
              {categories.map((category) => ( // Maps over the categories array to create a row for each.
                <tr key={category._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium"><div className="flex items-center"><Tag className="h-4 w-4 mr-3 text-gray-400" />{category.name}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{category.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm"> {/* Container for action buttons. */}
                    <Link to={`/dashboard/categorias/editar/${category._id}`} className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg"><Edit className="h-4 w-4 inline-block" /></Link> {/* Edit button. */}
                    <button onClick={() => handleRemove(category._id)} className="p-2 hover:bg-red-100 text-red-600 rounded-lg ml-2"><Trash2 className="h-4 w-4 inline-block" /></button> {/* Delete button. */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default CategoryManagement; // Exports the component.