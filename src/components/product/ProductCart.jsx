import { Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";

const ProductCart = ({product, onQuantityChange, onRemoveProduct}) => {
  const [quantity, setQuantity] = useState(product.quantity)
  const [price, setPrice] = useState(product.price * product.quantity)
  const {updateCart} = useUser()

  const minusQuantity = () => {
  if(quantity > 0){
    const newQty = quantity - 1
    setQuantity(newQty)
    setPrice(product.price * newQty)
    updateCart(product, newQty)
    onQuantityChange(product.id, newQty)
  }
}
const plusQuantity = () => {
  if(quantity < product.inStock){
   const newQty = quantity + 1
    setQuantity(newQty)
    setPrice(product.price * newQty)
    updateCart(product, newQty)
    onQuantityChange(product.id, newQty)
  }
}

  return (
    <li className="py-6">
      <div className={`flex items-center py-5 border border-gray-200 flex-col sm:flex-row rounded-lg p-3 ${quantity === 0 ? "bg-gray-100" : ""}`}>
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg mb-3 sm:mb-0 ">
          <img
            src={`${product.image}`}
            alt={product.name}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{product.name} ({product.inStock} em estoque)</h3>
            <p className="ml-4 hidden sm:block">
              R$ {(price).toFixed(2)}
            </p>
          </div>
          <p className="my-1 text-sm text-gray-500 line-clamp-1">
            {product.description}
          </p>
          <p className="fw-light text-sm text-gray-500">{product.inStock} em estoque</p>
          <p className="sm:hidden text-gray-900">
            R$ {(price).toFixed(2)}
          </p>
          <div className="flex flex-1 items-end justify-between text-sm mt-2">
            <div className="flex items-center border rounded-lg border-gray-200">
             <button
                    className={`h-10 w-10 rounded-none flex items-center justify-center hover:bg-gray-200 ${quantity === 0 ? "bg-gray-200 cursor-not-allowed text-gray-400": "cursor-pointer"}`}
                    aria-label="Diminuir quantidade"
                    onClick={() => minusQuantity()}
                  >
                <Minus className="h-3 w-3" />
              </button>
              <span className="px-3">{quantity}</span>
              <button
                    className={`h-10 w-10 rounded-r-lg flex items-center justify-center hover:bg-gray-200  ${quantity === product.inStock ? "bg-gray-200 cursor-not-allowed text-gray-400": "cursor-pointer"}`}
                    aria-label="Aumentar quantidade"
                    onClick={() => plusQuantity()}
                  >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <button className="text-red-500 hover:text-red-600 text-sm flex items-center hover:bg-gray-200 p-2 rounded-lg cursor-pointer" onClick={() => onRemoveProduct(product.id)}>
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
