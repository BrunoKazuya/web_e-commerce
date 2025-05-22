import { Minus, Plus, X } from "lucide-react";

const ProductCart = (prop) => {
  return (
    <li className="py-6">
      <div className="flex items-center py-5 border-b border-gray-200 flex-col sm:flex-row">
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg mb-3 sm:mb-0">
          <img
            src={`${prop.fakeProduct.image}`}
            alt={prop.fakeProduct.name}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{prop.fakeProduct.name}</h3>
            <p className="ml-4 hidden sm:block">
              R$ {(prop.fakeProduct.price * prop.fakeQuantity).toFixed(2)}
            </p>
          </div>
          <p className="my-1 text-sm text-gray-500 line-clamp-1">
            {prop.fakeProduct.description}
          </p>
          <p className="sm:hidden text-gray-900">
            R$ {(prop.fakeProduct.price * prop.fakeQuantity).toFixed(2)}
          </p>
          <div className="flex flex-1 items-end justify-between text-sm mt-2">
            <div className="flex items-center border rounded-lg border-gray-200">
              <button
                className="h-8 w-8 rounded-none flex items-center justify-center cursor-pointer hover:bg-gray-200"
                aria-label="Diminuir quantidade"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="px-3">{prop.fakeQuantity}</span>
              <button
                className="h-8 w-8 rounded-none flex items-center justify-center cursor-pointer hover:bg-gray-200"
                aria-label="Aumentar quantidade"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <button className="text-red-500 hover:text-red-600 text-sm flex items-center hover:bg-gray-200 p-2 rounded-lg cursor-pointer">
              <X className="h-3 w-3 mr-1" />
              Remover
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};


export default ProductCart;
