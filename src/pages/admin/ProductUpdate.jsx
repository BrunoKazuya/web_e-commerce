import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { ArrowLeft } from "lucide-react";
import { useProduct } from "../../contexts/ProductContext";
import ProductForm from "../../components/product/ProductForm";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../../components/ui/Loading";

const ProductUpdate = () => {
  const { updateProduct, getProductById } = useProduct();
  const { id } = useParams();
  const navigate = useNavigate()
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function load() {
      try {
        const fetched = await getProductById(id);
        setProduct(fetched);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const update = (newProduct) => {
    updateProduct(newProduct);
  };

  if (loading) {
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
            <h1 className="text-2xl font-bold mb-6">{product.name}</h1>
            <ProductForm
              isAdd={false}
              product={product}
              update={(newProduct) => {
                update(newProduct);
                navigate("/dashboard/produtos")
              }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductUpdate;
