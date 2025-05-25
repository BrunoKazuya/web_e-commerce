import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);
  const handleMouseEnter = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const handleMouseLeave = () => {
    // fecha só depois de 200ms, para dar tempo de passar do botão pro menu
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  };

  return (
    <header>
      <nav className="bg-white shadow-md z-50">
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
            <div className="flex space-x-2">
              <div className="p-2 hover:bg-blue-100 rounded-lg cursor-pointer flex items-center">
                <Search className="h-5 w-5" />
              </div>
              {isLoggedIn && (
                <a
                  href="/carrinho"
                  className="relative p-2 hover:bg-blue-100 rounded-lg"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-2 -right-2 bg-blue-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </a>
              )}
              {!isLoggedIn && (
                <Link
                  to={"/auth"}
                  className="py-2 px-4 border border-gray-200 cursor-pointer hover:bg-gray-100 rounded-lg"
                >
                  Entrar
                </Link>
              )}
              {isLoggedIn && (
                <div
                  className="relative inline-block"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="p-2 hover:bg-blue-100 rounded-lg">
                    <User className="h-5 w-5" />
                  </button>

                  {open && (
                    <ul
                      className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-50"
                      onMouseEnter={handleMouseEnter} // mantém aberto
                      onMouseLeave={handleMouseLeave} // fecha quando sair do menu
                    >
                      <li>
                        <Link
                          to="/perfil"
                          className="block px-4 py-2 text-sm hover:bg-blue-100"
                        >
                          Meu Perfil
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                           logout()
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-blue-100 cursor-pointer"
                        >
                          Sair
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              )}

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
