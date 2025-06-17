// src/pages/admin/ProductUpdate.jsx (Versão Corrigida)

import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Loading from "../../components/ui/Loading";
import ProductForm from "../../components/product/ProductForm";
import apiClient from "../../utils/apiClient";
import { useProduct } from "../../contexts/ProductContext"; // Precisamos do updateProduct do contexto

const ProductUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Pegamos as categorias e a função de ATUALIZAÇÃO do nosso contexto global
  const { categories, updateProduct } = useProduct();
  
  const [product, setProduct] = useState(null); // Inicia como null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Função para buscar os dados específicos deste produto
    const loadProductData = async () => {
      if (!id) {
        navigate('/dashboard/produtos');
        return;
      }
      try {
        const productData = await apiClient(`/products/${id}`);
        setProduct(productData);
      } catch (err) {
        setError("Não foi possível carregar o produto para edição.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProductData();
  }, [id, navigate]);

  // Função que será passada para o formulário
  const handleUpdateProduct = async (formData) => {
    setError('');
    setIsSubmitting(true);
    console.log("oi")
    try {
      // Chama a função 'updateProduct' do CONTEXTO.
      // O contexto fará a chamada à API e depois re-buscará a lista de produtos.
      await updateProduct(id, formData);

      alert('Produto atualizado com sucesso!');
      navigate('/dashboard/produtos');
    } catch (err) {
      console.log(err)
      setError(err.message || "Não foi possível atualizar o produto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Enquanto os dados estão carregando, exibe o Loading.
  if (loading) return <Loading size="lg" />;
  
  // 2. Se ocorreu um erro na busca, exibe a mensagem de erro.
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  // 3. (MUDANÇA CRUCIAL) Se o carregamento terminou, mas o produto não foi encontrado, não renderiza o formulário.
  if (!product) return <p className="text-center py-10">Produto não encontrado.</p>;

  // 4. Se tudo deu certo, renderiza a página com o formulário.
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
            
            {/* CORREÇÃO DAS PROPS PASSADAS PARA O ProductForm */}
            <ProductForm
              isAdd={false}
              product={product} // Passa os dados do produto para preencher o formulário
              categories={categories} // Passa a lista de categorias para o dropdown
              onFormSubmit={handleUpdateProduct} // Passa a função de submit correta
              isSubmitting={isSubmitting} // Passa o estado de "enviando"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductUpdate;