import { ShoppingCart } from "lucide-react";

const ProductCard = () => {
    return (
        <div className="rounded-3xl border border-gray-200 bg-white">
                <div className="rounded-t-3xl overflow-hidden h-[190px]">
                  <img
                    src="/img/produto1.avif"
                    alt="Premium Wireless Headphones"
                    className="object-cover object-center h-full w-full"
                  />
                </div>
                <div className="p-2.5 space-y-2.5">
                  <h3 className="text-lg">Premium Wireless Headphones</h3>
                  <p className="text-lg font-bold">R$459,99</p>
                </div>
                <div className="flex justify-evenly items-center py-5 px-2.5">
                  <a
                    href="/produto"
                    className="bg-white rounded-xl py-2.5 px-5 text-sm border border-gray-300 hover:bg-gray-100"
                  >
                    Ver Detalhes
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