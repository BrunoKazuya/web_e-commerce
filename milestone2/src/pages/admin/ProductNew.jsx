import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { ArrowLeft } from "lucide-react";
import { useProduct } from "../../contexts/ProductContext";
import ProductForm from "../../components/product/ProductForm";
import { useState, useEffect } from "react";
import Loading from "../../components/ui/Loading";
const ProductNew = () => {
    const {addProduct, getCategories} = useProduct()
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([])
  useEffect(() => {
    async function load() {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories)
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <Loading size="lg" />;
  }
  const add = (newProduct) => {
    addProduct(newProduct);
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
            <ProductForm isAdd={true} add={(newProduct) => add(newProduct)} categories={categories}/>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductNew;
