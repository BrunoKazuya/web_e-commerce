const OrderCard = ({order}) => {
  return (
    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">Pedido #{order.id}</p>
          <p className="text-sm text-gray-600">{order.date}</p>
        </div>
        <div className="text-right">
          <p className="font-medium">R${order.total}</p>
          <p className="text-sm text-green-600">
            Em trânsito
          </p>
        </div>
      </div>
    </div>
  );
};


export default OrderCard
