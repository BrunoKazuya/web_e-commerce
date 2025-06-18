import { Menu, Search, ShoppingCart, User, X } from "lucide-react"; // Imports icons from the lucide-react library.
import { useState, useRef } from "react"; // Imports React hooks for state management and references.
import { useAuth } from "../contexts/AuthContext"; // Imports the custom hook to access authentication context.
import { Link } from "react-router-dom"; // Imports the Link component for client-side navigation.
import { useUser } from "../contexts/UserContext"; // Imports the custom hook to access user-related data like the cart.
import { useNavigate } from "react-router-dom"; // Imports the hook for programmatic navigation.

const Navbar = () => { // Defines the Navbar functional component.
  const { isLoggedIn, logout, isAdmin } = useAuth(); // Destructures authentication status and functions from the AuthContext.
  const { cartQuantity } = useUser(); // Destructures cart quantity from the UserContext.
  const navigate = useNavigate(); // Initializes the navigate function.

  const [isOpen, setIsOpen] = useState(false); // State to manage the mobile menu toggle (open/closed).
  const [open, setOpen] = useState(false); // State to manage the user profile dropdown menu.
  const [search, setSearch] = useState(""); // State to hold the value of the search input.
  const [selectedSearch, setSelectedSearch] = useState(false); // State to toggle the visibility of the search bar.
  const closeTimer = useRef(null); // A ref to hold the timer for closing the dropdown, persists across renders.

  const handleMouseEnter = () => { // Function to handle mouse entering the dropdown trigger area.
    clearTimeout(closeTimer.current); // Clears any existing timer to prevent the menu from closing.
    setOpen(true); // Opens the dropdown menu.
  };
  const handleMouseLeave = () => { // Function to handle mouse leaving the dropdown area.
    closeTimer.current = setTimeout(() => setOpen(false), 200); // Sets a timer to close the menu after a short delay.
  };

  const handleSubmit = (e) => { // Function to handle the search form submission.
    e.preventDefault(); // Prevents the default form submission behavior.
    navigate(`/produtos?searchNavbar=${search}`); // Navigates to the products page with the search term as a query parameter.
  };

  return ( // Returns the JSX for the header and navigation bar.
    <header> {/* Header element. */}
      <nav className="bg-white shadow-md z-50 relative"> {/* Nav element with styling and z-index to stay on top. */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Centered container with max-width. */}
          <div className="flex justify-between h-16 items-center"> {/* Main flex container for navbar items. */}
            <div className=""> {/* Container for the brand/logo. */}
              <a href="/" className="text-xl font-bold text-blue-700"> {/* Brand link. */}
                Buy Things
              </a>
            </div>
            <div className="hidden sm:flex space-x-8"> {/* Container for desktop navigation links, hidden on small screens. */}
              <a href="/produtos" className="hover:text-blue-600"> {/* Link to products page. */}
                Produtos
              </a>
              <a href="/sobre" className="hover:text-blue-600"> {/* Link to about page. */}
                Sobre
              </a>
              <a href="/contato" className="hover:text-blue-600"> {/* Link to contact page. */}
                Contato
              </a>
            </div>
            <div className="flex space-x-2"> {/* Container for right-side icons and actions. */}
              <div // Search icon container.
                className="p-2 hover:bg-blue-100 rounded-lg cursor-pointer flex items-center"
                onClick={() => setSelectedSearch(!selectedSearch)} // Toggles the search bar visibility.
              >
                <Search className="h-5 w-5" /> {/* Search icon. */}
              </div>
              {isLoggedIn && ( // Conditionally renders the shopping cart icon if the user is logged in.
                <a
                  href="/carrinho" // Link to the cart page.
                  className="relative p-2 hover:bg-blue-100 rounded-lg"
                >
                  <ShoppingCart className="h-5 w-5" /> {/* Shopping cart icon. */}
                  {cartQuantity > 0 && ( // Conditionally renders the cart quantity badge if the cart is not empty.
                    <span className="absolute -top-2 -right-2 bg-blue-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartQuantity}
                    </span>
                  )}
                </a>
              )}
              {!isLoggedIn && ( // Conditionally renders the "Login" button if the user is not logged in.
                <Link
                  to={"/auth"} // Links to the authentication page.
                  className="py-2 px-4 border border-gray-200 cursor-pointer hover:bg-gray-100 rounded-lg"
                >
                  Entrar
                </Link>
              )}
              {isLoggedIn && ( // Conditionally renders the user profile dropdown if the user is logged in.
                <div
                  className="relative inline-block" // Relative positioning for the dropdown.
                  onMouseEnter={handleMouseEnter} // Handles mouse enter to show the menu.
                  onMouseLeave={handleMouseLeave} // Handles mouse leave to hide the menu.
                >
                  <button className="p-2 hover:bg-blue-100 rounded-lg"> {/* Button that triggers the dropdown. */}
                    <User className="h-5 w-5" /> {/* User icon. */}
                  </button>

                  {open && ( // Conditionally renders the dropdown menu if 'open' state is true.
                    <ul
                      className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-50"
                      onMouseEnter={handleMouseEnter} // Keeps the menu open when the mouse is over it.
                      onMouseLeave={handleMouseLeave} // Closes the menu when the mouse leaves it.
                    >
                      {isAdmin && ( // Conditionally renders the Dashboard link if the user is an admin.
                        <li>
                          <Link
                            to="/dashboard" // Links to the admin dashboard.
                            className="block px-4 py-2 text-sm hover:bg-blue-100"
                          >
                            Dashboard
                          </Link>
                        </li>
                      )}

                      <li> {/* List item for the profile link. */}
                        <Link
                          to="/perfil" // Links to the user profile page.
                          className="block px-4 py-2 text-sm hover:bg-blue-100"
                        >
                          Meu Perfil
                        </Link>
                      </li>
                      <li> {/* List item for the logout button. */}
                        <button
                          onClick={() => { // Click handler for logging out.
                            logout(); // Calls the logout function from the context.
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

              <div // Container for the mobile menu toggle (hamburger/X icon).
                onClick={() => setIsOpen(!isOpen)} // Toggles the 'isOpen' state on click.
                className="sm:hidden p-2 hover:bg-blue-100 rounded-lg" // Only visible on small screens.
              >
                {!isOpen && <Menu className="h-5 w-5" />} {/* Shows hamburger icon when menu is closed. */}
                {isOpen && <X className="h-5 w-5" />} {/* Shows X icon when menu is open. */}
              </div>
            </div>
          </div>
          <div className={`${isOpen ? "block" : "hidden"} sm:hidden`}> {/* Mobile menu container, visibility depends on 'isOpen' state. */}
            <div className="px-2 py-2 space-y-2"> {/* Links inside the mobile menu. */}
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
        {selectedSearch && ( // Conditionally renders the search bar based on 'selectedSearch' state.
          <div className="mb-6 w-full absolute top-full mt-6 px-5 sm:px-0"> {/* Container for the search bar, positioned absolutely. */}
            <form onSubmit={handleSubmit}> {/* Search form. */}
              <div className="relative w-full sm:w-md mx-auto"> {/* Relative container for the input and icon. */}
                <svg // Inline SVG for the search icon.
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
                <input // The search input field.
                  id="search"
                  type="text"
                  placeholder="Buscar produtos"
                  value={search} // Binds the input value to the 'search' state.
                  onChange={(e) => setSearch(e.target.value)} // Updates the 'search' state on change.
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