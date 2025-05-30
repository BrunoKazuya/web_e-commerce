import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PurchaseSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
        <h1 className="text-3xl font-bold mb-2">Compra Concluída!</h1>
        <p className="mb-6 text-gray-700">
          Obrigado pela sua compra! Seu pedido foi processado com sucesso.
        </p>
        <Link
          to="/produtos"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Voltar às compras
        </Link>
      </div>
    </div>
  );
};

export default PurchaseSuccess;
