import { Link } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";

const ProductItem = ({ product, removeProducts }) => {
  return (
    <tr key={product.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <img
              src={`/img/products/${product.image}`}
              alt={product.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {product.name}
            </div>
            <div className="text-sm text-gray-500">ID: {product.id}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{product.category}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          R${" "}
          {product.price.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{product.inStock}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex">
        <Link
          to={`/dashboard/produtos/editar/${product.id}`}
          className="text-blue-600 cursor-pointer hover:bg-blue-100 p-2 rounded"
        >
          <Edit className="h-4 w-4" />
        </Link>
        <button
          className="text-red-600 cursor-pointer hover:bg-blue-100 p-2 rounded ml-2"
          onClick={removeProducts}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
};

export default ProductItem;
