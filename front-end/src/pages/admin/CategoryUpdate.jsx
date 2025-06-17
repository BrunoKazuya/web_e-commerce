// src/pages/admin/CategoryUpdate.jsx

import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Loading from "../../components/ui/Loading";
import apiClient from "../../utils/apiClient";
import CategoryForm from "../../components/category/CategoryForm";

const CategoryUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCategoryData = async () => {
      if (!id) return navigate('/dashboard/categorias');
      try {
        const data = await apiClient(`/categories/${id}`);
        setCategory(data);
      } catch (err) {
        setError("Não foi possível carregar a categoria.");
      } finally {
        setLoading(false);
      }
    };
    loadCategoryData();
  }, [id, navigate]);

  const handleUpdateCategory = async (formData) => {
    setError('');
    setIsSubmitting(true);
    try {
      await apiClient(`/categories/${id}`, { method: 'PUT', body: formData });
      alert('Categoria atualizada com sucesso!');
      navigate('/dashboard/categorias');
    } catch (err) {
      setError(err.message || 'Não foi possível atualizar a categoria.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading size="lg" />;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <Link to="/dashboard/categorias" className="flex items-center text-blue-600 hover:text-blue-800 mb-5">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Gerenciamento de Categorias
        </Link>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Editar Categoria</h1>
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</div>}
          <CategoryForm
            isAdd={false}
            category={category}
            onFormSubmit={handleUpdateCategory}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryUpdate;