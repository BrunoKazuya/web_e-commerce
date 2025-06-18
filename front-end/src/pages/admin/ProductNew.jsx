// src/pages/admin/ProductNew.jsx

import { Link, useNavigate } from "react-router-dom"; // Imports routing components.
import { useState } from "react"; // Imports the useState hook.
import { ArrowLeft } from "lucide-react"; // Imports an icon.
import Footer from "../../components/Footer"; // Imports the Footer component.
import Navbar from "../../components/Navbar"; // Imports the Navbar component.
import Loading from "../../components/ui/Loading"; // Imports the loading spinner.
import ProductForm from "../../components/product/ProductForm"; // Imports the reusable product form.
import { useProduct } from "../../contexts/ProductContext"; // Imports the custom product context hook.

const ProductNew = () => { // Defines the component for adding a new product.
  // 1. Gets the add function, categories list, and status from the context.
  // We no longer need a useEffect or local state for categories.
  const { addProduct, categories, status: contextStatus } = useProduct();
  const navigate = useNavigate(); // Initializes the navigate function.

  // 2. Local state only to control the form submission.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 3. The submit function is now 'async' and handles the entire API flow.
  const handleAddProduct = async (formData) => {
    setError(''); // Clears previous errors.
    setIsSubmitting(true);
    
    try {
      // Calls the function from the context, which makes the API call and updates the global state.
      await addProduct(formData);

      // If the call is successful, provides feedback and redirects.
      alert('Produto adicionado com sucesso!');
      navigate('/dashboard/produtos');

    } catch (err) {
      // If the API returns an error, it will be caught and displayed.
      console.error("Erro ao adicionar produto:", err);
      setError(err.message || 'Não foi possível adicionar o produto.');
    } finally {
      // Ensures the 'submitting' state is deactivated at the end.
      setIsSubmitting(false);
    }
  };
  
  // Displays a general loading indicator while categories (needed for the form) are loaded by the context.
  if (contextStatus === 'loading') {
    return <Loading size="lg" />;
  }

  return ( // Returns the JSX for the page.
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2 py-16">
        <div>
          <Link
            to="/dashboard/produtos"
            className="flex items-center text-blue-600 hover:text-blue-800 mb-5"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Gerenciamento de Produtos
          </Link>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">Adicionar Novo Produto</h1>
            
            {/* Displays an error message, if any */}
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">
                {error}
              </div>
            )}

            {/* 4. Passes the correct props to the ProductForm */}
            <ProductForm
              isAdd={true}
              onFormSubmit={handleAddProduct}
              categories={categories}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductNew; // Exports the component.