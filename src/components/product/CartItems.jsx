const CartItems = ({cartItems}) => {

    
    if (!cartItems || cartItems.length === 0) {
        
    return <p>O carrinho está vazio</p>;
    }
    return (
        <ul>
        {cartItems.map((product) => (
            <li key={product.id} className="py-1">
            <div className={`flex items-center py-5 border border-gray-200 flex-col sm:flex-row rounded-lg p-3 ${product.quantity === 0 ? "bg-gray-100" : ""}`}>
                <div className="flex-shrink-0 items-center overflow-hidden rounded-lg sm:mb-0 ">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-12 w-12 object-cover object-center"
                />
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                <div className="flex justify-between text-sm font-medium text-gray-900">
                    <h3>{product.name}</h3>
                    <p className="hidden sm:block">
                    R$ {product.price.toFixed(2)}
                    </p>
                </div>
                <p className="my-1 text-sm text-gray-500 line-clamp-1">
                </p>
                <p className="fw-light text-sm text-gray-500">{product.inStock} em estoque</p>
                <p className="sm:hidden text-gray-900">
                    R$ {product.price.toFixed(2)}
                </p>
                <div className="flex flex-1 items-end justify-between text-sm mt-2">
                    <div className="flex items-center  rounded-lg">
                    <span className="">Quantidade: {product.quantity}</span>
                    </div>
                </div>
                </div>
            </div>
            </li>
        ))}
        </ul>
    );
};

export default CartItems;
