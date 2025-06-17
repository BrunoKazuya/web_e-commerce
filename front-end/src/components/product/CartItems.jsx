const CartItems = ({ cartItems }) => {
  if (!cartItems || cartItems.length === 0) {
    return <p className="text-sm text-gray-500">O carrinho está vazio.</p>;
  }

  return (
    <ul role="list" className="divide-y divide-gray-200">
      {cartItems.map((item) => (
        // CORREÇÃO: Usando _id do MongoDB para a key
        <li key={item._id} className="flex py-4">
          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
            <img
              src={`http://localhost:3000${item.image}`}
              alt={item.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="ml-4 flex flex-1 flex-col">
            <div>
              <div className="flex justify-between text-base font-medium text-gray-900">
                <h3 className="line-clamp-1">{item.name}</h3>
                <p className="ml-4 whitespace-nowrap">
                  {(item.price * item.quantity).toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>
            <div className="flex flex-1 items-end justify-between text-sm">
              <p className="text-gray-500">Qtd: {item.quantity}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CartItems;