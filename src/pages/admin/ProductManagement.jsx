import React from 'react'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom';
import { useProduct } from '../../contexts/ProductContext';
const ProductManagement = () => {
  const {getProducts} = useProduct()
  const initialProducts = getProducts()
  const [products, setProducts] = React.useState(initialProducts)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState(null)
 
  // Filtro
  const filteredProducts = products.filter((p) => {
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    if (selectedCategory && p.category !== selectedCategory) return false
    return true
  })
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Produtos</h1>
          <p className="text-gray-600">Gerencie seu inventário de produtos</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to={"/dashboard/produtos/novo"}
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
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
            >
              <option value="">Todas as Categorias</option>
              {Array.from(new Set(initialProducts.map((p) => p.category))).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory(null)
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
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          src={`${product.image}`}
                          alt={product.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">R$ {product.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.inStock
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inStock ? 'Em Estoque' : 'Fora de Estoque'}
                    </span>
                    {product.featured && (
                      <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Destacado
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-blue-600 cursor-pointer hover:bg-blue-100 p-2 rounded"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="text-red-600 cursor-pointer hover:bg-blue-100 p-2 rounded ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
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
          Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredProducts.length}</span> de{' '}
          <span className="font-medium">{filteredProducts.length}</span> resultados
        </p>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-100" disabled>
            Anterior
          </button>
          <button className="px-3 py-1 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-100" disabled>
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
