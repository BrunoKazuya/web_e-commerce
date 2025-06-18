import { CheckCircle } from "lucide-react"; // Imports the CheckCircle icon.
import { Link } from "react-router-dom"; // Imports the Link component for navigation.

const PurchaseSuccess = () => { // Defines the PurchaseSuccess component.
  return ( // Returns the JSX for the page.
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4"> {/* Full-height container to center the content. */}
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center"> {/* Centered card for the success message. */}
        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" /> {/* Success icon. */}
        <h1 className="text-3xl font-bold mb-2">Compra Concluída!</h1> {/* Success title. */}
        <p className="mb-6 text-gray-700"> {/* Success message paragraph. */}
          Obrigado pela sua compra! Seu pedido foi processado com sucesso.
        </p>
        <Link // Link to go back to the shopping page.
          to="/produtos"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Voltar às compras
        </Link>
      </div>
    </div>
  );
};

export default PurchaseSuccess; // Exports the component.