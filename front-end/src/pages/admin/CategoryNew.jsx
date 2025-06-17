// src/pages/admin/CategoryNew.jsx

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import apiClient from "../../utils/apiClient";
import CategoryForm from "../../components/category/CategoryForm";

const CategoryNew = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAddCategory = async (formData) => {
    setError('');
    setIsSubmitting(true);
    try {
      await apiClient('/categories', { method: 'POST', body: formData });
      alert('Categoria adicionada com sucesso!');
      navigate('/dashboard/categorias');
    } catch (err) {
      setError(err.message || 'Não foi possível adicionar a categoria.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <Link to="/dashboard/categorias" className="flex items-center text-blue-600 hover:text-blue-800 mb-5">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Gerenciamento de Categorias
        </Link>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Adicionar Nova Categoria</h1>
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</div>}
          <CategoryForm
            isAdd={true}
            onFormSubmit={handleAddCategory}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryNew;