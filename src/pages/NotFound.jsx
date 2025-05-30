
import { Link } from 'react-router-dom';

 const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Página não encontrada</p>
      <Link to="/" className="text-blue-600 hover:underline">
        Voltar para o início
      </Link>
    </div>
  );
}

export default NotFound