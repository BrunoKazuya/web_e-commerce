import { ShoppingCart } from "lucide-react";
import { useProduct } from "../../contexts/ProductContext";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
const ProductCard = ({id}) => {
  const navigate = useNavigate()
  const {addCart} = useUser()
  const {getProductById} = useProduct()
    const info = getProductById(id);
    if (!info||!info.image) return null;
const cart = () => {
  addCart(info, 1)
  navigate('/carrinho')
}
    
    return (
        <div className="rounded-3xl border border-gray-200 bg-white">
                <div className="rounded-t-3xl overflow-hidden h-[190px]">
                  <img
                    src={info.image}
                    alt="Premium Wireless Headphones"
                    className="object-cover object-center h-full w-full"
                  />
                </div>
                <div className="p-2.5 space-y-2.5">
                  <h3 className="text-lg">{info.name}</h3>
                  <p className="text-lg font-bold">{info.price}</p>
                </div>
                <div className="flex justify-evenly items-center py-5 px-2.5">
                  <a
                    href={`/produto/${id}`}
                    className="bg-white rounded-xl py-2.5 px-5 text-sm border border-gray-300 hover:bg-gray-100"
                  >
                    Detalhes
                  </a>
                  <button
                    className="bg-blue-600 text-white rounded-xl py-2.5 px-5 text-sm hover:bg-blue-500 flex items-center cursor-pointer" onClick={() => cart()}
                  >
                    <ShoppingCart className="me-2" />
                    Add
                  </button>
                </div>
              </div>
    )
}

export default ProductCard;