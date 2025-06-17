// src/components/product/ProductCart.jsx (Com Seletor de Botões)

import { Minus, Plus, Trash2 } from "lucide-react";

const ProductCart = ({ product, onQuantityChange, onRemoveProduct }) => {
  // A lógica agora está nos próprios botões, de forma mais simples.
  const canDecrease = product.quantity > 1;
  const canIncrease = product.quantity < product.inStock;

  return (
    <li className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img 
          src={`http://localhost:3000${product.image}`} 
          alt={product.name} 
          className="h-full w-full object-cover object-center" 
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{product.name}</h3>
            <p className="ml-4 whitespace-nowrap">
              {(product.price * product.quantity).toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Preço Unit.: {product.price.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Em estoque: {product.inStock}
          </p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm mt-4">
          {/* AQUI ESTÁ A MUDANÇA: Voltamos para o seletor com botões e span */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button 
              onClick={() => onQuantityChange(product._id, product.quantity - 1)}
              disabled={!canDecrease}
              className="h-8 w-8 flex items-center justify-center rounded-l-lg transition-colors hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <Minus className="h-3 w-3" />
            </button>
            
            <span className="px-4 text-sm font-medium w-10 text-center">{product.quantity}</span>
            
            <button 
              onClick={() => onQuantityChange(product._id, product.quantity + 1)}
              disabled={!canIncrease}
              className="h-8 w-8 flex items-center justify-center rounded-r-lg transition-colors hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="flex">
            <button 
              onClick={() => onRemoveProduct(product._id)} 
              type="button" 
              className="font-medium text-red-600 hover:text-red-500 flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" /> Remover
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ProductCart;