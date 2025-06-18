import { Link } from 'react-router-dom'; // Imports the Link component for navigation.

 const NotFound = () => { // Defines the NotFound component for 404 pages.
  return ( // Returns the JSX for the page.
    <div className="flex flex-col items-center justify-center h-screen"> {/* Full-height container to center the content. */}
      <h1 className="text-6xl font-bold mb-4">404</h1> {/* The "404" error number. */}
      <p className="text-xl mb-8">Página não encontrada</p> {/* The "Page not found" message. */}
      <Link to="/" className="text-blue-600 hover:underline"> {/* Link to return to the homepage. */}
        Voltar para o início
      </Link>
    </div>
  );
}

export default NotFound; // Exports the component.