import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useProduct } from "../../contexts/ProductContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/ui/Loading";
import ProductItem from "../../components/admin/ProductItem";
const ProductManagement = () => {
  const { getProducts, removeProducts } = useProduct();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [loading, setLoading] = useState(true);
  const filteredProducts = products.filter((p) => {
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      return false;
    if (selectedCategory && p.category !== selectedCategory) return false;
    return true;
  });

  useEffect(() => {
    async function load() {
      try {
        const fetched = await getProducts();
        setProducts(fetched);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <Loading size="lg" />;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gerenciamento de Produtos</h1>
            <p className="text-gray-600">Gerencie seu inventário de produtos</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              to={"/dashboard/produtos/novo"}
              className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-800 flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Novo Produto
            </Link>
          </div>
        </div>

        {/* Search e Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
            <div>
              <select
                className="w-full p-2 border border-gray-200 rounded-md"
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
              >
                <option value="">Todas as Categorias</option>
                {Array.from(new Set(products.map((p) => p.category))).map(
                  (cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory(null);
                }}
                className="px-4 py-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-100"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Tabela de Produtos */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Em estoque
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    removeProducts={() => {
                      removeProducts(product.id);
                      const newProducts = products.filter(
                        (p) => p.id !== product.id
                      );
                      setProducts(newProducts);
                    }}
                  />
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Nenhum produto encontrado com os critérios selecionados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginação (dummy) */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-500">
            Mostrando <span className="font-medium">1</span> a{" "}
            <span className="font-medium">{filteredProducts.length}</span> de{" "}
            <span className="font-medium">{filteredProducts.length}</span>{" "}
            resultados
          </p>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-100"
              disabled
            >
              Anterior
            </button>
            <button
              className="px-3 py-1 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-100"
              disabled
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default ProductManagement;
