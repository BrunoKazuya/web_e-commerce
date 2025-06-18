import { useMemo, useState } from "react"; // Imports React hooks.
import { Plus, Search } from "lucide-react"; // Imports icons.
import { Link } from "react-router-dom"; // Imports Link for navigation.
import { useProduct } from "../../contexts/ProductContext"; // Imports the custom product context hook.
import Navbar from "../../components/Navbar"; // Imports the Navbar component.
import Footer from "../../components/Footer"; // Imports the Footer component.
import Loading from "../../components/ui/Loading"; // Imports the loading spinner.
import ProductItem from "../../components/admin/ProductItem"; // Imports the component for a single product row in the table.

const ProductManagement = () => { // Defines the ProductManagement admin page component.
 const { products, status, removeProduct } = useProduct(); // Destructures data and functions from the product context.
 
 // Local state only for the filters on this page.
 const [searchTerm, setSearchTerm] = useState("");
 const [selectedCategory, setSelectedCategory] = useState("");

 const handleRemove = async (id) => { // Defines an async function to handle product removal.
   if (window.confirm('Tem certeza que deseja deletar este produto?')) {
     try {
       await removeProduct(id); // Calls the removeProduct function from the context.
       alert('Produto deletado com sucesso!');
     } catch (error) {
       alert(`Erro ao deletar produto: ${error.message}`);
     }
   }
 };

 // Filters products based on search and category states.
 const filteredProducts = useMemo(() => {
   return products.filter((p) => {
     const searchMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
     const categoryMatch = selectedCategory ? p.category?.name === selectedCategory : true;
     return searchMatch && categoryMatch;
   });
 }, [products, searchTerm, selectedCategory]); // Recalculates when dependencies change.

 if (status === 'loading') { // Shows a loading spinner if the context data is loading.
   return <Loading size="lg" />;
 }
 
 if (status === 'error') { // Shows an error message if the context failed to load data.
   return <p className="text-center text-red-500 py-10">Erro ao carregar produtos.</p>
 }

 return ( // Returns the JSX for the page.
   <>
     <Navbar />
     <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2 py-10"> {/* Main content container. */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"> {/* Page header. */}
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

       {/* Search and Filter */}
       <div className="bg-white p-4 rounded-lg shadow-sm mb-8 border border-gray-200">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="relative"> {/* Search input container. */}
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
             <input
               type="text"
               placeholder="Buscar produtos..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 px-3 py-2 border border-gray-200 rounded-md"
             />
           </div>
           <div> {/* Category filter dropdown. */}
             <select
               className="w-full p-2 border border-gray-200 rounded-md"
               value={selectedCategory || ""}
               onChange={(e) => setSelectedCategory(e.target.value || null)}
             >
               <option value="">Todas as Categorias</option>
               {Array.from(new Set(products.map((p) => p.category?.name))).map( // Creates a unique list of category names for the options.
                 (cat) => (
                   <option key={cat} value={cat}>
                     {cat}
                   </option>
                 )
               )}
             </select>
           </div>
           <div className="flex justify-end"> {/* Clear filters button. */}
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

       {/* Products Table */}
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
               {filteredProducts.map((product) => ( // Maps over the filtered products to create table rows.
                 <ProductItem
                   key={product._id}
                   product={product}
                   handleRemove={(id) => handleRemove(id)}
                 />
               ))}
               {filteredProducts.length === 0 && ( // Renders a message if no products match the filters.
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

       {/* Pagination (dummy) */}
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