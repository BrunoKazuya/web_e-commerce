// Object to map API status to text and colors
const statusStyles = {
  processing: { text: 'Processando', classes: 'bg-yellow-100 text-yellow-800' },
  shipped: { text: 'Enviado', classes: 'bg-blue-100 text-blue-800' },
  delivered: { text: 'Entregue', classes: 'bg-green-100 text-green-800' },
  cancelled: { text: 'Cancelado', classes: 'bg-red-100 text-red-800' },
};

const OrderCard = ({ order }) => { // Defines the OrderCard component, which receives an 'order' object as a prop.
  // Gets the style and text corresponding to the order status
  const statusInfo = statusStyles[order.orderStatus] || { text: 'Desconhecido', classes: 'bg-gray-100 text-gray-800' }; // Looks up the status style, with a fallback for unknown statuses.

  return ( // Returns the JSX for the component.
    <div className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"> {/* Main container for the card with styling and hover effect. */}
      <div className="flex justify-between items-center"> {/* Flex container to position elements. */}
        <div> {/* Container for the order number and date. */}
          <p className="font-semibold text-gray-800">Pedido #{order._id.substring(0, 8)}...</p> {/* Displays "Order #" and a shortened version of the order ID. */}
          <p className="text-sm text-gray-600"> {/* Paragraph for the order date. */}
            {new Date(order.createdAt).toLocaleDateString("pt-BR")} {/* Formats the creation date to a local date string. */}
          </p>
        </div>
        <div className="text-right"> {/* Container for the price and status, aligned to the right. */}
          <p className="font-bold text-lg text-gray-900"> {/* Paragraph for the total price. */}
            {order.totalPrice.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })} {/* Formats the total price as currency. */}
          </p>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.classes}`}> {/* A span for the status badge with dynamic classes. */}
            {statusInfo.text} {/* Displays the text for the current status. */}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderCard; // Exports the OrderCard component.