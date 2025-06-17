// Objeto para mapear os status da API para textos e cores em português
const statusStyles = {
  processing: { text: 'Processando', classes: 'bg-yellow-100 text-yellow-800' },
  shipped: { text: 'Enviado', classes: 'bg-blue-100 text-blue-800' },
  delivered: { text: 'Entregue', classes: 'bg-green-100 text-green-800' },
  cancelled: { text: 'Cancelado', classes: 'bg-red-100 text-red-800' },
};

const OrderCard = ({ order }) => {
  // Pega o estilo e o texto correspondente ao status do pedido
  const statusInfo = statusStyles[order.orderStatus] || { text: 'Desconhecido', classes: 'bg-gray-100 text-gray-800' };

  return (
    // O card inteiro agora é um link para a página de detalhes do pedido
    <div className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-center">
        <div>
          {/* Usando _id para o número do pedido (mostrando apenas uma parte) */}
          <p className="font-semibold text-gray-800">Pedido #{order._id.substring(0, 8)}...</p>
          {/* Usando createdAt para a data */}
          <p className="text-sm text-gray-600">
            {new Date(order.createdAt).toLocaleDateString("pt-BR")}
          </p>
        </div>
        <div className="text-right">
          {/* Usando totalPrice para o valor */}
          <p className="font-bold text-lg text-gray-900">
            {order.totalPrice.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })}
          </p>
          {/* Usando o status dinâmico */}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.classes}`}>
            {statusInfo.text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;