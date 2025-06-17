import { Link } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";

const ProductItem = ({ product, handleRemove }) => {
  return (
    <tr key={product._id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
         <div className="h-10 w-10 flex-shrink-0">
            <img
              src={`http://localhost:3000${product.image}`}
              alt={product.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {product.category?.name}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {product.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">{product.inStock}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <Link
          to={`/dashboard/produtos/editar/${product._id}`}
          className="hover:bg-blue-100 text-blue-600 p-2 rounded-lg"
        >
          <Edit className="h-4 w-4 inline-block" />
        </Link>
        <button
          onClick={() => handleRemove(product._id)}
          className="hover:bg-red-100 text-red-600 p-2 rounded-lg ml-2"
        >
          <Trash2 className="h-4 w-4 inline-block" />
        </button>
      </td>
    </tr>
  );
};

export default ProductItem;
