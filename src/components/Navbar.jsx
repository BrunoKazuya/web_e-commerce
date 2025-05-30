import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { isLoggedIn, logout, isAdmin } = useAuth();
  const { cartQuantity } = useUser();
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSearch, setSelectedSearch] = useState(false);
  const closeTimer = useRef(null);
  const handleMouseEnter = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(`/produtos?searchNavbar=${search}`)
  }

  return (
    <header>
      <nav className="bg-white shadow-md z-50 relative">
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
              <div
                className="p-2 hover:bg-blue-100 rounded-lg cursor-pointer flex items-center"
                onClick={() => setSelectedSearch(!selectedSearch)}
              >
                <Search className="h-5 w-5" />
              </div>
              {isLoggedIn && (
                <a
                  href="/carrinho"
                  className="relative p-2 hover:bg-blue-100 rounded-lg"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartQuantity}
                    </span>
                  )}
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
                      {isAdmin && (
                        <li>
                          <Link
                            to="/dashboard"
                            className="block px-4 py-2 text-sm hover:bg-blue-100"
                          >
                            Dashboard
                          </Link>
                        </li>
                      )}

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
                            logout();
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
              <a href="/contato" className="block hover:text-blue-600">
                Contato
              </a>
            </div>
          </div>
        </div>
        {selectedSearch && (
          <div className="mb-6 w-full absolute top-full mt-6 px-5 sm:px-0">
            <form onSubmit={handleSubmit}>
              <div className="relative w-full sm:w-md mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                >
                  <path d="m21 21-4.34-4.34" />
                  <circle cx="11" cy="11" r="8" />
                </svg>
                <input
                  id="search"
                  type="text"
                  placeholder="Buscar produtos"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-white shadow-lg"
                />
              </div>
            </form>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
