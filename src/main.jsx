import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AboutPage from './pages/AboutPage.jsx'
import IndexPage from './pages/IndexPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import CartPage from './pages/CartPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import ProductManagement from './pages/admin/ProductManagement.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage/>
  },
  {
    path: "sobre",
    element: <AboutPage/>
  },
  {
    path: "auth",
    element: <AuthPage/>
  },
  {
    path: "carrinho",
    element: <CartPage/>
  },
  {
    path: "contato",
    element: <ContactPage/>
  },
  {
    path: "produto/:id",
    element: <ProductDetailPage/>
  },
  {
    path: "produtos",
    element: <ProductsPage/>
  },
  {
    path: "admin",
    element: <Dashboard/>
  },
  {
    path: "perfil",
    element: <ProfilePage/>
  },
  {
    path: "contato",
    element: <ContactPage/>
  },
  {
    path: "dashboard/produtos",
    element: <ProductManagement/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
