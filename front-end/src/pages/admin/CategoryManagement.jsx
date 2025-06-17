// src/pages/admin/CategoryManagement.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import Loading from "../../components/ui/Loading";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import apiClient from "../../utils/apiClient";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await apiClient('/categories');
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleRemove = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta categoria? Produtos associados perderão sua categoria.')) {
      try {
        await apiClient(`/categories/${id}`, { method: 'DELETE' });
        setCategories(current => current.filter(c => c._id !== id));
      } catch (err) {
        alert(`Erro ao deletar: ${err.message}`);
      }
    }
  };

  if (loading) return <Loading size="lg" />;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gerenciamento de Categorias</h1>
            <p className="text-gray-600">Adicione, edite ou remova categorias.</p>
          </div>
          <Link to="/dashboard/categorias/novo" className="bg-blue-600 hover:bg-blue-800 rounded-lg flex text-white items-center py-2 px-3">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Categoria
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome da Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium"><div className="flex items-center"><Tag className="h-4 w-4 mr-3 text-gray-400" />{category.name}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{category.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link to={`/dashboard/categorias/editar/${category._id}`} className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg"><Edit className="h-4 w-4 inline-block" /></Link>
                    <button onClick={() => handleRemove(category._id)} className="p-2 hover:bg-red-100 text-red-600 rounded-lg ml-2"><Trash2 className="h-4 w-4 inline-block" /></button>
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

export default CategoryManagement;