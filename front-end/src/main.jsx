import { StrictMode } from "react"; // Imports React's StrictMode for highlighting potential problems.
import { createRoot } from "react-dom/client"; // Imports the function to create the root of the React app.
import "./index.css"; // Imports the global CSS file.
import { createBrowserRouter, RouterProvider } from "react-router-dom"; // Imports components for routing.

// Imports all the page components.
import AboutPage from "./pages/AboutPage.jsx";
import IndexPage from "./pages/IndexPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProductManagement from "./pages/admin/ProductManagement.jsx";
import ProductNew from "./pages/admin/ProductNew.jsx";
import ProductUpdate from "./pages/admin/ProductUpdate.jsx";
import UserManagement from "./pages/admin/UserManagement.jsx";
import UserNew from "./pages/admin/UserNew.jsx";
import UserUpdate from "./pages/admin/UserUpdate.jsx";
import CategoryManagement from "./pages/admin/CategoryManagement.jsx";
import CategoryNew from "./pages/admin/CategoryNew.jsx";
import CategoryUpdate from "./pages/admin/CategoryUpdate.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import PurchaseSuccess from "./pages/EndPage.jsx";
import NotFound from "./pages/NotFound.jsx";

// Imports the context providers.
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext.jsx";
import { ProductProvider } from "./contexts/ProductContext.jsx";
import PrivateRoute from "./contexts/PrivateRoute.jsx"; // Imports the component for protecting routes.

const router = createBrowserRouter([ // Creates the router configuration.
  {
    path: "/", // Root path.
    element: <IndexPage />, // Renders the homepage.
  },
  {
    path: "sobre", // About page path.
    element: <AboutPage />,
  },
  {
    path: "auth", // Authentication (login/register) page path.
    element: <AuthPage />,
  },
  {
    path: "carrinho", // Cart page path.
    element: ( // This route is protected.
      <PrivateRoute>
        <CartPage />
      </PrivateRoute>
    ),
  },  
  {
    path: "checkout", // Checkout page path.
    element: ( // This route is protected.
      <PrivateRoute>
        <CheckoutPage />
      </PrivateRoute>
    ),
  },
  {
    path: "sucesso", // Purchase success page path.
    element: (
        <PurchaseSuccess />
    ),
  },
  {
    path: "contato", // Contact page path.
    element: <ContactPage />,
  },
  {
    path: "produto/:id", // Product detail page path with a dynamic ID parameter.
    element: <ProductDetailPage />,
  },
  {
    path: "produtos", // All products page path.
    element: <ProductsPage />,
  },
  {
    path: "dashboard", // Admin dashboard path.
    element: ( // Protected route that requires an 'admin' role.
      <PrivateRoute requiredRole={"admin"}>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "perfil", // User profile page path.
    element: ( // Protected route.
      <PrivateRoute>
        <ProfilePage />
      </PrivateRoute>
    ),
  },
  {
    path: "dashboard/produtos", // Admin product management path.
    element: ( // Protected route for admins.
      <PrivateRoute requiredRole={"admin"}>
        <ProductManagement />
      </PrivateRoute>
    ),
  },
  {
    path: "dashboard/produtos/novo", // Admin path to add a new product.
    element: ( // Protected route for admins.
      <PrivateRoute requiredRole={"admin"}>
        <ProductNew />
      </PrivateRoute>
    ),
  },
  {
    path: "dashboard/produtos/editar/:id", // Admin path to edit a product.
    element: ( // Protected route for admins.
      <PrivateRoute requiredRole={"admin"}>
        <ProductUpdate />
      </PrivateRoute>
    ),
  },
  {
    path: "dashboard/usuarios", // Admin user management path.
    element: ( // Protected route for admins.
      <PrivateRoute requiredRole={"admin"}>
        <UserManagement />
      </PrivateRoute>
    ),
  },
  {
    path: "dashboard/usuarios/novo", // Admin path to add a new user.
    element: ( // Protected route for admins.
      <PrivateRoute requiredRole={"admin"}>
        <UserNew />
      </PrivateRoute>
    ),
  },
  {
    path: "dashboard/usuarios/editar/:id", // Admin path to edit a user.
    element: ( // Protected route for admins.
      <PrivateRoute requiredRole={"admin"}>
        <UserUpdate />
      </PrivateRoute>
    ),
  },
   {
    path: "dashboard/categorias", // Admin category management path.
    element: ( // Protected route for admins.
      <PrivateRoute requiredRole={"admin"}>
        <CategoryManagement />
      </PrivateRoute>
    ),
  },
  {
    path: "dashboard/categorias/novo", // Admin path to add a new category.
    element: ( // Protected route for admins.
      <PrivateRoute requiredRole={"admin"}>
        <CategoryNew />
      </PrivateRoute>
    ),
  },
  {
    path: "dashboard/categorias/editar/:id", // Admin path to edit a category.
    element: ( // Protected route for admins.
      <PrivateRoute requiredRole={"admin"}>
        <CategoryUpdate />
      </PrivateRoute>
    ),
  },
  {
    path:'*', // Wildcard path to catch any undefined routes.
    element: <NotFound/> // Renders the 404 Not Found page.
  }
]);

createRoot(document.getElementById("root")).render( // Renders the application into the DOM.
  <StrictMode> {/* Enables React's Strict Mode. */}
    <AuthProvider> {/* Wraps the app in the AuthProvider to manage authentication state. */}
    <UserProvider> {/* Wraps the app in UserProvider for user data like cart, orders, etc. */}
        <ProductProvider> {/* Wraps the app in ProductProvider to manage products and categories globally. */}
          <RouterProvider router={router} /> {/* Provides the router configuration to the application. */}
        </ProductProvider>
    </UserProvider>
    </AuthProvider>
  </StrictMode>
);