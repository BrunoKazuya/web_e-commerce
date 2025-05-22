import { ShoppingCart } from "lucide-react";
import { getProductById } from "../../data/products";

const ProductCard = ({id}) => {
    const info = getProductById(id);
    if (!info||!info.image) return null;

    
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
                    href="/produto"
                    className="bg-white rounded-xl py-2.5 px-5 text-sm border border-gray-300 hover:bg-gray-100"
                  >
                    Detalhes
                  </a>
                  <a
                    href="/carrinho"
                    className="bg-blue-600 text-white rounded-xl py-2.5 px-5 text-sm hover:bg-blue-500 flex items-center"
                  >
                    <ShoppingCart className="me-2" />
                    Add
                  </a>
                </div>
              </div>
    )
}

export default ProductCard;