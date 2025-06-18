// src/pages/admin/ProductUpdate.jsx

import { Link, useParams, useNavigate } from "react-router-dom"; // Imports routing hooks.
import { useEffect, useState } from "react"; // Imports React hooks.
import { ArrowLeft } from "lucide-react"; // Imports an icon.
import Footer from "../../components/Footer"; // Imports the Footer component.
import Navbar from "../../components/Navbar"; // Imports the Navbar component.
import Loading from "../../components/ui/Loading"; // Imports the loading spinner.
import ProductForm from "../../components/product/ProductForm"; // Imports the reusable product form.
import apiClient from "../../utils/apiClient"; // Imports the API client.
import { useProduct } from "../../contexts/ProductContext"; // We need updateProduct from the context.

const ProductUpdate = () => { // Defines the component for updating a product.
  const { id } = useParams(); // Gets the product ID from the URL.
  const navigate = useNavigate(); // Initializes the navigate function.
  // Gets the categories list and the UPDATE function from our global context.
  const { categories, updateProduct } = useProduct();
  
  const [product, setProduct] = useState(null); // Initializes as null.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Function to fetch the specific data for this product.
    const loadProductData = async () => {
      if (!id) { // Redirects if there is no ID.
        navigate('/dashboard/produtos');
        return;
      }
      try {
        const productData = await apiClient(`/products/${id}`); // Fetches the product by its ID.
        setProduct(productData); // Sets the fetched data to state.
      } catch (err) {
        setError("Não foi possível carregar o produto para edição.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProductData();
  }, [id, navigate]); // Runs when 'id' changes.

  // Function that will be passed to the form.
  const handleUpdateProduct = async (formData) => {
    setError('');
    setIsSubmitting(true);
    try {
      // Calls the 'updateProduct' function from the CONTEXT.
      // The context will make the API call and then re-fetch the product list.
      await updateProduct(id, formData);

      alert('Produto atualizado com sucesso!');
      navigate('/dashboard/produtos');
    } catch (err) {
      console.log(err);
      setError(err.message || "Não foi possível atualizar o produto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. While data is loading, display the Loading component.
  if (loading) return <Loading size="lg" />;
  
  // 2. If an error occurred during the fetch, display the error message.
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  // 3. (CRUCIAL CHANGE) If loading is finished but the product was not found, do not render the form.
  if (!product) return <p className="text-center py-10">Produto não encontrado.</p>;

  // 4. If everything went well, render the page with the form.
  return (
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
            <h1 className="text-2xl font-bold mb-6">Editar: {product.name}</h1>
            
            {/* CORRECTION OF PROPS PASSED TO ProductForm */}
            <ProductForm
              isAdd={false}
              product={product} // Passes the product data to pre-fill the form.
              categories={categories} // Passes the categories list to the dropdown.
              onFormSubmit={handleUpdateProduct} // Passes the correct submit function.
              isSubmitting={isSubmitting} // Passes the "submitting" state.
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductUpdate;