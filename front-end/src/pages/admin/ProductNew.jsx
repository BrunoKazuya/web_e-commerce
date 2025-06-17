// src/pages/admin/ProductNew.jsx (Versão Corrigida e Final)

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Loading from "../../components/ui/Loading";
import ProductForm from "../../components/product/ProductForm";
import { useProduct } from "../../contexts/ProductContext";

const ProductNew = () => {
  // 1. Pega a função de adicionar, a lista de categorias e o status do contexto.
  // Não precisamos mais de um useEffect ou estado local para as categorias.
  const { addProduct, categories, status: contextStatus } = useProduct();
  const navigate = useNavigate();

  // 2. Estado local apenas para controlar o envio do formulário.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 3. A função de submit agora é 'async' e lida com todo o fluxo da API.
  const handleAddProduct = async (formData) => {
    setError('');
    setIsSubmitting(true);
    
    try {
      // Chama a função do contexto, que faz a chamada à API e atualiza o estado global.
      await addProduct(formData);

      // Se a chamada for bem-sucedida, dá um feedback e redireciona.
      alert('Produto adicionado com sucesso!');
      navigate('/dashboard/produtos');

    } catch (err) {
      // Se a API retornar um erro, ele será capturado e exibido.
      console.error("Erro ao adicionar produto:", err);
      setError(err.message || 'Não foi possível adicionar o produto.');
    } finally {
      // Garante que o estado de 'submitting' seja desativado no final.
      setIsSubmitting(false);
    }
  };
  
  // Exibe um loading geral enquanto as categorias (necessárias para o form) são carregadas pelo contexto.
  if (contextStatus === 'loading') {
    return <Loading size="lg" />;
  }

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
            <h1 className="text-2xl font-bold mb-6">Adicionar Novo Produto</h1>
            
            {/* Exibe uma mensagem de erro, se houver */}
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">
                {error}
              </div>
            )}

            {/* 4. Passa as props corretas para o ProductForm */}
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

export default ProductNew;