import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="">
              <a href="/" className="text-xl font-bold text-blue-700">
                Buy Things
              </a>
            </div>
            <div className="hidden sm:flex space-x-8">
              <a href="/produtos" className="hover:text-blue-600">
                Produtos
              </a>
              <a href="/sobre" className="hover:text-blue-600">
                Sobre
              </a>
              <a href="/contato" className="hover:text-blue-600">
                Contato
              </a>
            </div>
            <div className="flex space-x-1">
              <div className="p-2 hover:bg-blue-100 rounded-lg cursor-pointer">
                <Search className="h-5 w-5" />
              </div>
              <a
                href="/carrinho"
                className="relative p-2 hover:bg-blue-100 rounded-lg"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-blue-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </a>
              <a href="/perfil" className="p-2 hover:bg-blue-100 rounded-lg">
                <User className="h-5 w-5" />
              </a>
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="sm:hidden p-2 hover:bg-blue-100 rounded-lg"
              >
                {!isOpen && <Menu className="h-5 w-5" />}
                {isOpen && <X className="h-5 w-5" />}
              </div>
            </div>
          </div>
          <div className={`${isOpen ? "block" : "hidden"} sm:hidden`}>
            <div className="px-2 py-2 space-y-2">
              <a href="/produtos" className="block hover:text-blue-600">
                Produtos
              </a>
              <a href="/sobre" className="block hover:text-blue-600">
                Sobre
              </a>
              <a href="/contatos" className="block hover:text-blue-600">
                Contatos
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
