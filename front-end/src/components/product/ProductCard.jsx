import { ShoppingCart } from "lucide-react";
import { useUser } from "../../contexts/UserContext";
import { useNavigate, Link } from "react-router-dom"; // 1. Importe o Link

// 2. O componente agora recebe o objeto 'product' inteiro como prop.
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  // Nós ainda precisamos do useUser para a função addCart.
  const { addCart } = useUser();
  // A busca de dados foi REMOVIDA daqui.

  // 3. Uma "guarda" para evitar erros se o produto não for passado.
  if (!product) {
    return null;
  }

  const isOutOfStock = product.inStock === 0;

  // 4. A função do carrinho agora usa o objeto 'product' e verifica o estoque.
  const handleAddToCart = () => {
    if (isOutOfStock) return; // Não faz nada se não houver estoque.
    
    addCart(product, 1);
    navigate("/carrinho");
  };

  return (
    <div className="group relative flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* 5. O link agora usa o componente <Link> e o _id do produto */}
      <Link to={`/produto/${product._id}`} className="flex-grow">
        <div className="aspect-h-1 aspect-w-1 w-full bg-gray-200">
          <img
            src={`http://localhost:3000${product.image}`}
            alt={product.name}
            className="h-48 w-full object-cover object-center group-hover:opacity-80 transition-opacity"
          />
        </div>
        <div className="p-4 space-y-2">
          {/* 6. Todas as referências a 'info' foram trocadas por 'product' */}
          <h3 className="text-base font-semibold text-gray-800 truncate" title={product.name}>
            {product.name}
          </h3>
          <p className="text-lg font-bold text-gray-900">
            {product.price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
      </Link>
      
      {/* Ações separadas do link principal */}
      <div className="border-t border-gray-200 p-4 mt-auto">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock} // 7. O botão é desabilitado se não houver estoque
          className={`w-full flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors ${
            isOutOfStock
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isOutOfStock ? 'Sem Estoque' : 'Adicionar'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;